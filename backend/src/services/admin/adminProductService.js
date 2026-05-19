import adminProductRepository from '../../repositories/admin/adminProductRepository.js';
import productVariantRepository from '../../repositories/productVariantRepository.js';
import productImageRepository from '../../repositories/productImageRepository.js';
import uploadService from '../uploadService.js';
import AppError from '../../utils/AppError.js';
import { ERROR_CODES } from '../../constants/errorCode.js';
import { getPagination, getPaginationData } from '../../utils/pagination.js';

class AdminProductService {
  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _formatProduct(product) {
    return {
      product_id: product.product_id,
      product_name: product.product_name,
      slug: product.slug,
      product_description: product.product_description,
      material: product.material,
      gender: product.gender,
      base_price: product.base_price,
      status: product.status,
      brand: product.brand_id
        ? { brand_id: product.brand_id, brand_name: product.brand_name }
        : null,
      category: product.category_id
        ? {
            category_id: product.category_id,
            category_name: product.category_name,
            category_slug: product.category_slug,
          }
        : null,
      thumbnail: product.thumbnail ?? null,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  _formatProductDetail(product) {
    return {
      ...this._formatProduct(product),
      images: product.images ?? [],
      variants: product.variants ?? [],
    };
  }

  // ─── Queries ──────────────────────────────────────────────────────────────────

  /**
   * Lấy danh sách sản phẩm (kể cả INACTIVE) với pagination.
   */
  async getAllProducts(queryParams) {
    const { limit, offset, currentPage } = getPagination(queryParams.page, queryParams.limit);

    const { items, total } = await adminProductRepository.findAll({
      limit,
      offset,
      search: queryParams.search,
      status: queryParams.status,
      category_id: queryParams.category_id,
      brand_id: queryParams.brand_id,
    });

    return {
      items: items.map((item) => this._formatProduct(item)),
      pagination: getPaginationData(total, currentPage, limit),
    };
  }

  /**
   * Lấy chi tiết sản phẩm (kể cả INACTIVE).
   */
  async getProductById(id) {
    const product = await adminProductRepository.findById(id);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }
    return this._formatProductDetail(product);
  }

  // ─── Mutations ────────────────────────────────────────────────────────────────

  /**
   * Tạo sản phẩm mới.
   */
  async createProduct(dto) {
    // Kiểm tra slug trùng
    const existing = await adminProductRepository.findBySlug(dto.slug);
    if (existing) {
      throw new AppError(
        `Slug "${dto.slug}" đã được sử dụng`,
        409,
        ERROR_CODES.PRODUCT.SLUG_ALREADY_EXISTS,
      );
    }

    const insertId = await adminProductRepository.create(dto);
    const product = await adminProductRepository.findById(insertId);
    return this._formatProductDetail(product);
  }

  /**
   * Cập nhật thông tin sản phẩm.
   */
  async updateProduct(id, dto) {
    const product = await adminProductRepository.findById(id);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }

    // Kiểm tra slug trùng (loại trừ chính nó)
    if (dto.slug) {
      const existing = await adminProductRepository.findBySlug(dto.slug, id);
      if (existing) {
        throw new AppError(
          `Slug "${dto.slug}" đã được sử dụng`,
          409,
          ERROR_CODES.PRODUCT.SLUG_ALREADY_EXISTS,
        );
      }
    }

    await adminProductRepository.update(id, dto);
    const updated = await adminProductRepository.findById(id);
    return this._formatProductDetail(updated);
  }

  /**
   * Toggle trạng thái active/inactive.
   */
  async updateStatus(id, status) {
    const product = await adminProductRepository.findById(id);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }
    await adminProductRepository.updateStatus(id, status);
    return { product_id: Number(id), status };
  }

  // ─── Images ────────────────────────────────────────────────────────────────

  /**
   * Thêm ảnh cho sản phẩm (upload lên Cloudinary, lưu DB).
   */
  async addImage(productId, file) {
    if (!file) {
      throw new AppError('Không có file ảnh', 400, ERROR_CODES.UPLOAD.NO_FILE);
    }
    const product = await adminProductRepository.findById(productId);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }
    const { buffer, mimetype } = file;
    const uploadResult = await uploadService.uploadImage(buffer, mimetype, 'products');

    // If this is the first image, mark as primary
    const existingImages = await productImageRepository.findByProductId(productId);
    const isPrimary = existingImages.length === 0;

    const imageId = await productImageRepository.create(productId, {
      image_url: uploadResult.url,
      public_id: uploadResult.publicId,
      is_primary: isPrimary,
      sort_order: existingImages.length,
    });
    return {
      image_id: imageId,
      image_url: uploadResult.url,
      public_id: uploadResult.publicId,
      is_primary: isPrimary,
      sort_order: existingImages.length,
    };
  }

  /**
   * Xóa ảnh khỏi Cloudinary và DB.
   */
  async deleteImage(productId, imageId) {
    const image = await productImageRepository.findById(imageId);
    if (!image || String(image.product_id) !== String(productId)) {
      throw new AppError('Ảnh không tồn tại hoặc không thuộc sản phẩm này', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }
    if (image.public_id) {
      await uploadService.deleteImage(image.public_id);
    }
    await productImageRepository.delete(imageId);
  }

  // ─── Variants ────────────────────────────────────────────────────────────────

  /**
   * Thêm variant cho sản phẩm.
   */
  async addVariant(productId, dto) {
    // Kiểm tra sản phẩm tồn tại
    const product = await adminProductRepository.findById(productId);
    if (!product) {
      throw new AppError('Sản phẩm không tồn tại', 404, ERROR_CODES.PRODUCT.NOT_FOUND);
    }

    // Kiểm tra SKU trùng (nếu có)
    if (dto.sku) {
      const skuExists = await productVariantRepository.findBySku(dto.sku);
      if (skuExists) {
        throw new AppError(
          `SKU "${dto.sku}" đã được sử dụng`,
          409,
          ERROR_CODES.PRODUCT.VARIANT_SKU_EXISTS,
        );
      }
    }

    const insertId = await productVariantRepository.create(productId, dto);
    return await productVariantRepository.findById(insertId);
  }

  /**
   * Cập nhật variant.
   */
  async updateVariant(variantId, dto) {
    const variant = await productVariantRepository.findById(variantId);
    if (!variant) {
      throw new AppError(
        'Biến thể sản phẩm không tồn tại',
        404,
        ERROR_CODES.PRODUCT.VARIANT_NOT_FOUND,
      );
    }

    // Kiểm tra SKU trùng (loại trừ chính nó)
    if (dto.sku) {
      const skuExists = await productVariantRepository.findBySku(dto.sku, variantId);
      if (skuExists) {
        throw new AppError(
          `SKU "${dto.sku}" đã được sử dụng`,
          409,
          ERROR_CODES.PRODUCT.VARIANT_SKU_EXISTS,
        );
      }
    }

    await productVariantRepository.update(variantId, dto);
    return await productVariantRepository.findById(variantId);
  }

  /**
   * Xóa variant.
   */
  async deleteVariant(variantId) {
    const variant = await productVariantRepository.findById(variantId);
    if (!variant) {
      throw new AppError(
        'Biến thể sản phẩm không tồn tại',
        404,
        ERROR_CODES.PRODUCT.VARIANT_NOT_FOUND,
      );
    }
    await productVariantRepository.delete(variantId);
  }
}

export default new AdminProductService();
