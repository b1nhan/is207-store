import voucherService from '../../services/voucherService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminVoucherController {
  /**
   * GET /admin/vouchers
   */
  async getAllVouchers(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await voucherService.getAll({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /admin/vouchers/:id
   */
  async getVoucherById(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      const voucher = await voucherService.getById(voucherId);
      sendSuccess(res, { data: voucher });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /admin/vouchers
   */
  async createVoucher(req, res, next) {
    try {
      const adminUserId = req.user.user_id; // from verifyToken middleware
      const voucherDto = req.body;
      const newVoucher = await voucherService.createVoucher(voucherDto, adminUserId);
      sendSuccess(res, {
        data: { id: newVoucher },
        message: 'Tạo voucher thành công',
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /admin/vouchers/:id
   */
  async updateVoucher(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      const voucherDto = req.body;
      await voucherService.updateVoucher(voucherId, voucherDto);
      sendSuccess(res, { message: 'Cập nhật voucher thành công' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /admin/vouchers/:id
   */
  async deleteVoucher(req, res, next) {
    try {
      const voucherId = parseInt(req.params.id, 10);
      await voucherService.deleteVoucher(voucherId);
      sendSuccess(res, { message: 'Xóa voucher thành công' });
    } catch (error) {
      next(error);
    }
  }

  async generateDescription(req, res, next) {
    try {
      const { code, discount_type, discount_value, min_order_value, max_discount_amount } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Mã voucher là bắt buộc.' });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        let mockDescription = `Nhập mã ${code.toUpperCase()} để nhận ưu đãi giảm giá đặc biệt khi thanh toán đơn hàng.`;
        return sendSuccess(res, {
          data: {
            description: `[MÔ PHỎNG - Chưa cài GROQ_API_KEY] ${mockDescription}`
          },
          message: 'Tạo mô tả giả lập (chưa cấu hình API Key)'
        });
      }

      let typeDesc = '';
      if (discount_type === 'PERCENTAGE') {
        typeDesc = `giảm giá ${discount_value ? discount_value + '%' : ''} cho đơn hàng`;
        if (max_discount_amount) {
          typeDesc += ` (giảm tối đa ${Number(max_discount_amount).toLocaleString('vi-VN')}đ)`;
        }
      } else if (discount_type === 'FIXED') {
        typeDesc = `giảm ngay ${discount_value ? Number(discount_value).toLocaleString('vi-VN') + 'đ' : ''} cho đơn hàng`;
      } else if (discount_type === 'FREESHIP') {
        typeDesc = `miễn phí vận chuyển (Freeship)`;
        if (discount_value) {
          typeDesc += ` tối đa ${Number(discount_value).toLocaleString('vi-VN')}đ`;
        }
      } else {
        typeDesc = `ưu đãi giảm giá`;
      }

      if (min_order_value && Number(min_order_value) > 0) {
        typeDesc += ` có giá trị từ ${Number(min_order_value).toLocaleString('vi-VN')}đ`;
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
                content: `Hãy viết một câu mô tả ngắn gọn (khoảng 1 câu), thu hút cho voucher/mã giảm giá sau:\nMã voucher: ${code.toUpperCase()}\nƯu đãi: ${typeDesc}\n\nYêu cầu: Viết bằng tiếng Việt, ngắn gọn, súc tích, thúc giục mua sắm, không chứa các ký tự Markdown hay định dạng đặc biệt.`,
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
        message: 'Tạo mô tả voucher bằng AI thành công',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminVoucherController();
