import brandService from '../services/brandService.js';
import { sendSuccess } from '../utils/response.js';

//tiếp nhận yêu cầu từ user và trả lời
//ví dụ nếu user bấm vô sp thì nó sẽ gọi service và bảo service lấy ra
//sau đó dùng sendSuccess để đóng gói lại và gửi về frontend
class BrandController {
  getAllBrands = async (req, res, next) => {
    try {
      const result = await brandService.getAllBrands();
      // console.log(req.query);
      // let onlyforfixbug = req.query;
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách brand thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProductsByBrand = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await brandService.getAllProductsByBrand(id, req.query);
      sendSuccess(res, {
        data: result,
        message: `Lấy danh sách sản phẩm của danh mục ${result.brand.brand_name} thành công`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BrandController();
