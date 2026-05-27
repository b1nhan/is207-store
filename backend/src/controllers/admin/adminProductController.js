import adminProductService from '../../services/admin/adminProductService.js';
import { sendSuccess } from '../../utils/response.js';
import upload from '../../middlewares/uploadMiddleware.js';

class AdminProductController {
  // ─── Products ────────────────────────────────────────────────────────────────

  /**
   * GET /admin/products
   * Query: page, limit, search, status, category_id, brand_id
   */
  getAllProducts = async (req, res, next) => {
    try {
      const result = await adminProductService.getAllProducts(req.query);
      sendSuccess(res, {
        data: result,
        message: 'Lấy danh sách sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /admin/products/:id
   */
  getProductById = async (req, res, next) => {
    try {
      const product = await adminProductService.getProductById(req.params.id);
      sendSuccess(res, {
        data: product,
        message: 'Lấy chi tiết sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/products
   * Body validated by createProductSchema
   */
  createProduct = async (req, res, next) => {
    try {
      const product = await adminProductService.createProduct(req.body);
      sendSuccess(res, {
        data: product,
        message: 'Tạo sản phẩm thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/products/:id
   * Body validated by updateProductSchema
   */
  updateProduct = async (req, res, next) => {
    try {
      const product = await adminProductService.updateProduct(req.params.id, req.body);
      sendSuccess(res, {
        data: product,
        message: 'Cập nhật sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /admin/products/:id/status
   * Body: { status: 0 | 1 }
   */
  updateStatus = async (req, res, next) => {
    try {
      const result = await adminProductService.updateStatus(req.params.id, req.body.status);
      sendSuccess(res, {
        data: result,
        message: `Cập nhật trạng thái sản phẩm thành công`,
      });
    } catch (error) {
      next(error);
    }
  };

  // ─── Images ──────────────────────────────────────────────────────────────────

  /**
   * POST /admin/products/:id/images
   * multipart/form-data, field: "image"
   */
  addImage = async (req, res, next) => {
    try {
      const result = await adminProductService.addImage(req.params.id, req.file);
      sendSuccess(res, { data: result, message: 'Thêm ảnh thành công', status: 201 });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/products/:id/images/:imageId
   */
  deleteImage = async (req, res, next) => {
    try {
      await adminProductService.deleteImage(req.params.id, req.params.imageId);
      sendSuccess(res, { data: null, message: 'Xóa ảnh thành công' });
    } catch (error) {
      next(error);
    }
  };

  // ─── Variants ────────────────────────────────────────────────────────────────

  /**
   * POST /admin/products/:id/variants
   * Body validated by createVariantSchema
   */
  addVariant = async (req, res, next) => {
    try {
      const variant = await adminProductService.addVariant(req.params.id, req.body);
      sendSuccess(res, {
        data: variant,
        message: 'Thêm biến thể sản phẩm thành công',
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /admin/products/variants/:variantId
   * Body validated by updateVariantSchema
   */
  updateVariant = async (req, res, next) => {
    try {
      const variant = await adminProductService.updateVariant(req.params.variantId, req.body);
      sendSuccess(res, {
        data: variant,
        message: 'Cập nhật biến thể sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /admin/products/variants/:variantId
   */
  deleteVariant = async (req, res, next) => {
    try {
      await adminProductService.deleteVariant(req.params.variantId);
      sendSuccess(res, {
        data: null,
        message: 'Xóa biến thể sản phẩm thành công',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /admin/products/generate-description
   * Body: { name, keywords }
   */
  generateDescription = async (req, res, next) => {
    try {
      const { name, keywords } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Tên sản phẩm là bắt buộc.' });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        const mockDescription = `Sản phẩm ${name} chất lượng cao, thiết kế hiện đại và sang trọng. Được sản xuất từ các chất liệu cao cấp mang lại sự thoải mái tuyệt đối khi sử dụng. Đây là lựa chọn hoàn hảo cho phong cách năng động hàng ngày.`;
        return sendSuccess(res, {
          data: {
            description: `[MÔ PHỎNG - Chưa cài GROQ_API_KEY] ${mockDescription}`
          },
          message: 'Tạo mô tả giả lập (chưa cấu hình API Key)'
        });
      }

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: `Hãy viết một đoạn mô tả sản phẩm ngắn gọn, thu hút khách hàng cho sản phẩm sau:\nTên sản phẩm: ${name}\nThông tin chi tiết: ${keywords || 'Không có'}\n\nYêu cầu: Viết hoàn toàn bằng tiếng Việt, độ dài khoảng 3-4 câu, mô tả chân thực, tự nhiên và chuyên nghiệp, không chứa các ký tự Markdown hay định dạng đặc biệt.`,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API returned error status ${response.status}: ${errText}`);
      }

      const resData = await response.json();
      const aiText = resData.choices?.[0]?.message?.content?.trim() || '';

      sendSuccess(res, {
        data: { description: aiText },
        message: 'Tạo mô tả sản phẩm bằng AI thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminProductController();
