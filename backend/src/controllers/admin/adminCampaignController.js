import adminCampaignService from '../../services/admin/adminCampaignService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminCampaignController {
  getAllCampaigns = async (req, res, next) => {
    try {
      const result = await adminCampaignService.getAllCampaigns(req.query);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  getCampaignById = async (req, res, next) => {
    try {
      const result = await adminCampaignService.getCampaignById(req.params.id);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  createCampaign = async (req, res, next) => {
    try {
      const result = await adminCampaignService.createCampaign(req.body, req.user.user_id);
      sendSuccess(res, { data: result, message: 'Tạo campaign thành công', status: 201 });
    } catch (error) {
      next(error);
    }
  };

  updateCampaign = async (req, res, next) => {
    try {
      const result = await adminCampaignService.updateCampaign(req.params.id, req.body);
      sendSuccess(res, { data: result, message: 'Cập nhật campaign thành công' });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const result = await adminCampaignService.updateStatus(req.params.id, req.body.status);
      sendSuccess(res, { data: result, message: 'Cập nhật trạng thái campaign thành công' });
    } catch (error) {
      next(error);
    }
  };

  deleteCampaign = async (req, res, next) => {
    try {
      await adminCampaignService.deleteCampaign(req.params.id);
      sendSuccess(res, { message: 'Xóa campaign thành công' });
    } catch (error) {
      next(error);
    }
  };

  generateDescription = async (req, res, next) => {
    try {
      const { name, campaign_type, discount_value } = req.body;

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        const mockDescription = `Chiến dịch khuyến mãi ${name} cực kỳ hấp dẫn với nhiều ưu đãi đặc biệt dành cho khách hàng. Đừng bỏ lỡ cơ hội mua sắm tuyệt vời này!`;
        return sendSuccess(res, {
          data: {
            description: `[MÔ PHỎNG - Chưa cài GROQ_API_KEY] ${mockDescription}`
          },
          message: 'Tạo mô tả giả lập (chưa cấu hình API Key)'
        });
      }

      let typeDesc = '';
      if (campaign_type === 'PERCENTAGE') {
        typeDesc = `giảm giá ${discount_value ? discount_value + '%' : 'hấp dẫn'}`;
      } else if (campaign_type === 'FIXED_PRICE') {
        typeDesc = `đồng giá ${discount_value ? Number(discount_value).toLocaleString('vi-VN') + 'đ' : 'siêu rẻ'}`;
      } else if (campaign_type === 'TIER_DISCOUNT') {
        typeDesc = `ưu đãi giảm giá theo bậc (mua càng nhiều giảm càng sâu)`;
      } else if (campaign_type === 'FREESHIP') {
        typeDesc = `miễn phí vận chuyển (Freeship)`;
      } else {
        typeDesc = `khuyến mãi`;
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
                content: `Hãy viết một đoạn mô tả ngắn gọn, thu hút khách hàng cho chiến dịch khuyến mãi sau:\nTên chiến dịch: ${name}\nLoại chiến dịch: ${typeDesc}\n\nYêu cầu: Viết hoàn toàn bằng tiếng Việt, độ dài khoảng 2-3 câu, giọng văn hào hứng, thúc giục mua sắm, chuyên nghiệp, không chứa các ký tự Markdown hay định dạng đặc biệt.`,
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
        message: 'Tạo mô tả campaign bằng AI thành công',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminCampaignController();

