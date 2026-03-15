import categoryRepository from '../repositories/categoryRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

class CategoryService {
  async getAllCategories() {
    const { items } = await categoryRepository.findAll({});

    const formattedItems = items.map((item) => ({
      category_id: item.category_id,
      category_name: item.category_name,
      slug: item.slug,
    }));

    return {
      items: formattedItems,
    };
  }

  async getAllProductsByCategory(slug, queryParams) {
    // thêm slug vào đây
    const { limit, currentPage, offset } = getPagination(
      queryParams.page,
      queryParams.limit,
    );

    const [categoryInfo, { items, total }] = await Promise.all([
      categoryRepository.findCategoryBySlug(slug),
      categoryRepository.findBySlug(slug, {
        limit,
        offset,
        sortBy: queryParams.sortBy,
        sortOrder: queryParams.sortOrder,
      }),
    ]);

    if (!categoryInfo) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Danh mục không tồn tại', 404);
    }

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
      category: {
        // ← lồng category vào đây
        category_id: categoryInfo.category_id,
        category_name: categoryInfo.category_name,
        category_slug: categoryInfo.slug,
      },
      items: formattedItems,
      pagination: getPaginationData(total, currentPage, limit),
    };
  }
}

export default new CategoryService();
