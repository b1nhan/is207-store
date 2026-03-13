import productRepository from '../repositories/productRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

class ProductService {
  async getAllProducts(queryParams) {
    const { limit, offset, currentPage } = getPagination(
      queryParams.page,
      queryParams.limit,
    );

    const { items, total } = await productRepository.findAll({
      ...queryParams,
      limit,
      offset,
    });

    const formattedItems = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      base_price: item.base_price,
      sale_price: null, // Mặc định theo yêu cầu
      category_slug: item.category_slug,
      brand_name: item.brand_name,
      gender: item.gender,
      thumbnail: item.thumbnail,
      has_variants: true, // Có thể query thêm COUNT variants nếu cần chính xác
      status: 'ACTIVE',
    }));

    return {
      items: formattedItems,
      pagination: getPaginationData(total, currentPage, limit),
    };
  }

  async getProductDetail(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError(
        'Sản phẩm không tồn tại hoặc đã bị ẩn',
        404,
        ERROR_CODES.PRODUCT_NOT_FOUND,
      );
    }

    return {
      product_id: product.product_id,
      product_name: product.product_name,
      product_description: product.product_description,
      material: product.material,
      gender: product.gender,
      base_price: product.base_price,
      sale_price: null,
      brand: { brand_id: product.brand_id, brand_name: product.brand_name },
      category: {
        category_id: product.category_id,
        category_name: product.category_name,
        category_slug: product.category_slug,
      },
      images: product.images,
      variants: product.variants,
      status: 'ACTIVE',
      created_at: product.created_at,
    };
  }

  async searchProducts(q) {
    if (!q || q.length < 2) return [];
    return await productRepository.searchAutocomplete(q);
  }
}

export default new ProductService();
