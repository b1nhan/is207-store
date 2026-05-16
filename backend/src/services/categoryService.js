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
      product_count: item.product_count,
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
      throw new AppError('Danh mục không tồn tại', 404, ERROR_CODES.CATEGORY.NOT_FOUND);
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

  // ─── Admin write operations ───────────────────────────────────────────────────

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Danh mục không tồn tại', 404, ERROR_CODES.CATEGORY.NOT_FOUND);
    }
    return category;
  }

  async createCategory(dto) {
    // Kiểm tra trùng tên
    const existingName = await categoryRepository.findByName(dto.category_name);
    if (existingName) {
      throw new AppError('Tên danh mục đã tồn tại', 409, ERROR_CODES.CATEGORY.NAME_ALREADY_EXISTS);
    }
    // Kiểm tra trùng slug
    const existingSlug = await categoryRepository.findBySlugAdmin(dto.slug);
    if (existingSlug) {
      throw new AppError('Slug danh mục đã tồn tại', 409, ERROR_CODES.CATEGORY.SLUG_ALREADY_EXISTS);
    }
    return categoryRepository.create(dto);
  }

  async updateCategory(id, dto) {
    // Kiểm tra category tồn tại
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Danh mục không tồn tại', 404, ERROR_CODES.CATEGORY.NOT_FOUND);
    }
    // Kiểm tra trùng tên (bỏ qua chính nó)
    if (dto.category_name) {
      const existingName = await categoryRepository.findByName(dto.category_name, id);
      if (existingName) {
        throw new AppError('Tên danh mục đã tồn tại', 409, ERROR_CODES.CATEGORY.NAME_ALREADY_EXISTS);
      }
    }
    // Kiểm tra trùng slug (bỏ qua chính nó)
    if (dto.slug) {
      const existingSlug = await categoryRepository.findBySlugAdmin(dto.slug, id);
      if (existingSlug) {
        throw new AppError('Slug danh mục đã tồn tại', 409, ERROR_CODES.CATEGORY.SLUG_ALREADY_EXISTS);
      }
    }
    return categoryRepository.update(id, dto);
  }

  async deleteCategory(id) {
    // Kiểm tra tồn tại
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Danh mục không tồn tại', 404, ERROR_CODES.CATEGORY.NOT_FOUND);
    }
    // Kiểm tra còn sản phẩm không
    if (Number(category.product_count) > 0) {
      throw new AppError(
        'Không thể xóa danh mục còn chứa sản phẩm',
        409,
        ERROR_CODES.CATEGORY.HAS_PRODUCTS,
      );
    }
    await categoryRepository.delete(id);
  }
}

export default new CategoryService();
