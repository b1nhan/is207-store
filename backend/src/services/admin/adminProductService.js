import adminProductRepository from '../../repositories/admin/adminProductRepository.js';
import productVariantRepository from '../../repositories/productVariantRepository.js';
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
