import BrandRepository from '../repositories/brandRepository.js';
import AppError from '../utils/AppError.js';
import { ERROR_CODES } from '../constants/errorCode.js';
import { getPagination, getPaginationData } from '../utils/pagination.js';

//Tính toán logic, format lại dữ liệu cho đẹp
//gom thông tin trả về 1 cục gồm "Thông tin brand" +danh sách sản phẩm
//+thông tin phân trang

class BrandService {
  async getAllBrands() {
    const { items } = await BrandRepository.findAll({});

    const formattedItems = items.map((item) => ({
      brand_id: item.brand_id,
      brand_name: item.brand_name,
      product_count: item.product_count,
    }));

    return {
      items: formattedItems,
    };
  }

  async getAllProductsByBrand(brand_id, queryParams) {
    // thêm slug vào đây
    const { limit, currentPage, offset } = getPagination(
      queryParams.page,
      queryParams.limit,
    );

    const { items, total } = await BrandRepository.findByID(brand_id, {
      limit,
      offset,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
    });

    if (!items || (items.length === 0 && currentPage === 1)) {
    }

    const formattedItems = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      base_price: item.base_price,
      brand_name: item.brand_name,
      thumbnail: item.thumbnail,
      status: 'ACTIVE',
    }));

    return {
      brand: {
        // ← lồng brand vào đây nha ae
        brand_id: brand_id,
        brand_name: items[0]?.brand_name || 'Brand',
      },
      items: formattedItems,
      pagination: getPaginationData(total, currentPage, limit),
    };
  }

  // ─── Admin write operations ───────────────────────────────────────────────────

  async getBrandById(id) {
    const brand = await BrandRepository.findByIdAdmin(id);
    if (!brand) {
      throw new AppError('Thương hiệu không tồn tại', 404, ERROR_CODES.BRAND.NOT_FOUND);
    }
    return brand;
  }

  async createBrand(dto) {
    const existing = await BrandRepository.findByName(dto.brand_name);
    if (existing) {
      throw new AppError('Tên thương hiệu đã tồn tại', 409, ERROR_CODES.BRAND.NAME_ALREADY_EXISTS);
    }
    return BrandRepository.create(dto);
  }

  async updateBrand(id, dto) {
    // Kiểm tra tồn tại
    const brand = await BrandRepository.findByIdAdmin(id);
    if (!brand) {
      throw new AppError('Thương hiệu không tồn tại', 404, ERROR_CODES.BRAND.NOT_FOUND);
    }
    // Kiểm tra trùng tên (bỏ qua chính nó)
    if (dto.brand_name) {
      const existing = await BrandRepository.findByName(dto.brand_name, id);
      if (existing) {
        throw new AppError('Tên thương hiệu đã tồn tại', 409, ERROR_CODES.BRAND.NAME_ALREADY_EXISTS);
      }
    }
    return BrandRepository.update(id, dto);
  }

  async deleteBrand(id) {
    // Kiểm tra tồn tại
    const brand = await BrandRepository.findByIdAdmin(id);
    if (!brand) {
      throw new AppError('Thương hiệu không tồn tại', 404, ERROR_CODES.BRAND.NOT_FOUND);
    }
    // Kiểm tra còn sản phẩm không
    if (Number(brand.product_count) > 0) {
      throw new AppError(
        'Không thể xóa thương hiệu còn chứa sản phẩm',
        409,
        ERROR_CODES.BRAND.HAS_PRODUCTS,
      );
    }
    await BrandRepository.delete(id);
  }
}

export default new BrandService();
