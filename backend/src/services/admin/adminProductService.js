import adminProductRepository from '../../repositories/admin/adminProductRepository.js';
import productVariantRepository from '../../repositories/productVariantRepository.js';
import productImageRepository from '../../repositories/productImageRepository.js';
import uploadService from '../uploadService.js';
import AppError from '../../utils/AppError.js';
import { ERROR_CODES } from '../../constants/errorCode.js';
import { getPagination, getPaginationData } from '../../utils/pagination.js';

class AdminProductService {
  // ─── Helpers ─────────────────────────────────────────────────────────────────

  /**
   * Sinh SKU tự động từ thông tin sản phẩm + variant.
   * Format: {BRAND}-{PRODUCT}-{COLOR}-{SIZE}-{RAND4}
   * Ví dụ: NIK-AIRMAX-BLK-42-A3F1
   */
  _generateSku(product, dto) {
    const slugify = (str = '', maxLen = 6) =>
      str
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]+/g, '')
        .slice(0, maxLen);

    const brand   = slugify(product.brand_name, 4);   // VD: NIK
    const prod    = slugify(product.product_name, 6); // VD: AIRMAX
    const color   = slugify(dto.color, 4);             // VD: BLK
    const size    = slugify(String(dto.size ?? ''), 4); // VD: 42
    const rand    = Math.random().toString(16).slice(2, 6).toUpperCase(); // 4 hex chars

    return [brand, prod, color, size, rand]
      .filter(Boolean)
      .join('-');
  }

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

    // Tự động sinh SKU nếu frontend không gửi
    if (!dto.sku) {
      dto = { ...dto, sku: this._generateSku(product, dto) };
    }

    // Kiểm tra SKU trùng
    const skuExists = await productVariantRepository.findBySku(dto.sku);
    if (skuExists) {
      throw new AppError(
        `SKU "${dto.sku}" đã được sử dụng`,
        409,
        ERROR_CODES.PRODUCT.VARIANT_SKU_EXISTS,
      );
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

    // Nếu frontend không gửi SKU, giữ nguyên SKU cũ.
    // Nếu frontend gửi chuỗi rỗng / null, tự gen SKU mới.
    if (dto.sku === undefined) {
      // không chạm đến SKU
    } else if (!dto.sku) {
      // gửi rỗng → gen mới từ thông tin sản phẩm hiện tại
      const product = await adminProductRepository.findById(variant.product_id);
      dto = { ...dto, sku: this._generateSku(product, { ...variant, ...dto }) };
    }

    // Kiểm tra SKU trùng (loại trừ chính nó) nếu SKU thay đổi
    if (dto.sku && dto.sku !== variant.sku) {
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
