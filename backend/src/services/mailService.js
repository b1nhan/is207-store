import nodemailer from 'nodemailer';
import MAIL_CONFIG from '../config/mail.js';
import { logger } from '../utils/logger.js';
import { getDB } from '../database/connection.js';

class MailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * Khởi tạo transporter nếu cần thiết
   */
  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport(MAIL_CONFIG.SMTP);
    }
    return this.transporter;
  }

  async getAdminEmails() {
    const emails = new Set();

    // Luôn thêm email cấu hình từ env/code
    if (MAIL_CONFIG.ADMIN_EMAIL) {
      emails.add(MAIL_CONFIG.ADMIN_EMAIL.trim().toLowerCase());
    }

    try {
      const db = getDB();
      const [rows] = await db.query(
        `SELECT u.email 
         FROM users u
         JOIN roles r ON u.role_id = r.role_id
         WHERE r.role_name = 'admin'`
      );
      if (rows && rows.length > 0) {
        rows.forEach((row) => {
          if (row.email) {
            emails.add(row.email.trim().toLowerCase());
          }
        });
      }
    } catch (error) {
      logger.error(`Error querying admin emails: ${error.message}`);
    }

    return Array.from(emails);
  }

  /**
   * Gửi email chung
   */
  async sendMail({ to, subject, html }) {
    try {
      const config = MAIL_CONFIG;
      
      // Kiểm tra cấu hình SMTP trước khi gửi
      if (!config.SMTP.auth.user || !config.SMTP.auth.pass) {
        logger.warn(
          'Email Notification: SMTP credentials are empty. Please configure SMTP_USER and SMTP_PASS in your .env or mail.js file to send actual emails.'
        );
        // Log ra nội dung email để admin có thể debug/xem trực tiếp khi chưa config SMTP
        logger.info(`[SMTP Mock Log] Sending email to: ${to} | Subject: ${subject}`);
        return null;
      }

      const info = await this.getTransporter().sendMail({
        from: `"ShopFS" <${config.FROM_EMAIL}>`,
        to,
        subject,
        html,
      });

      logger.info(`Email notification sent to admin: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Error sending email to admin: ${error.message}`);
      // Không ném lỗi ra ngoài để tránh làm sập request đặt hàng/hủy đơn của client
      return null;
    }
  }

  /**
   * Định dạng tiền tệ VND
   */
  formatCurrency(value) {
    return Number(value).toLocaleString('vi-VN') + '₫';
  }

  /**
   * Gửi thông báo có đơn hàng mới cho admin
   * @param {object} order - Chi tiết đơn hàng
   * @param {object} user - Chi tiết người đặt hàng (optional)
   */
  async sendOrderPlacementNotification(order, user) {
    const adminEmails = await this.getAdminEmails();
    const to = adminEmails.join(', ');
    const subject = `[ĐƠN HÀNG MỚI] Đơn hàng #${order.order_id} đã được đặt thành công`;

    const customerName = user ? `${user.full_name || user.username} (${user.email})` : order.receiver_name;
    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px;">
          <strong>${item.product_name_snapshot}</strong>
          ${item.size_snapshot || item.color_snapshot ? `<br/><span style="color: #718096; font-size: 12px;">Phân loại: ${[item.size_snapshot, item.color_snapshot].filter(Boolean).join(' / ')}</span>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px; text-align: right;">
          ${this.formatCurrency(item.unit_price_snapshot)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px; text-align: right; font-weight: bold;">
          ${this.formatCurrency(item.line_total)}
        </td>
      </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border-top: 6px solid #3182ce;">
          
          <!-- Header -->
          <div style="padding: 30px; text-align: center; background-color: #ebf8ff;">
            <h1 style="margin: 0; color: #2b6cb0; font-size: 24px; font-weight: 800;">🔔 KHÁCH HÀNG ĐẶT ĐƠN HÀNG MỚI</h1>
            <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">Mã đơn hàng: <strong>#${order.order_id}</strong> | Ngày đặt: ${new Date(order.order_date || order.created_at).toLocaleString('vi-VN')}</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #2d3748; margin-top: 0;">Xin chào Admin,</p>
            <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
              Hệ thống vừa ghi nhận khách hàng <strong>${customerName}</strong> đã đặt một đơn hàng mới thành công. Dưới đây là thông tin chi tiết:
            </p>

            <!-- Thông tin giao hàng -->
            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #4299e1;">
              <h3 style="margin-top: 0; margin-bottom: 10px; color: #2d3748; font-size: 15px;">📍 Thông tin giao nhận</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 4px 0; color: #718096; width: 120px; vertical-align: top;">Người nhận:</td>
                  <td style="padding: 4px 0; color: #2d3748; font-weight: bold;">${order.receiver_name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096; vertical-align: top;">Số điện thoại:</td>
                  <td style="padding: 4px 0; color: #2d3748;">${order.receiver_phone}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096; vertical-align: top;">Địa chỉ nhận hàng:</td>
                  <td style="padding: 4px 0; color: #2d3748;">${order.shipping_address}</td>
                </tr>
              </table>
            </div>

            <!-- Chi tiết sản phẩm -->
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #2d3748; font-size: 15px;">🛍️ Danh sách sản phẩm</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #edf2f7;">
                  <th style="padding: 10px 12px; text-align: left; color: #4a5568; font-size: 13px; font-weight: bold; border-bottom: 2px solid #cbd5e0;">Sản phẩm</th>
                  <th style="padding: 10px 12px; text-align: center; color: #4a5568; font-size: 13px; font-weight: bold; border-bottom: 2px solid #cbd5e0; width: 60px;">SL</th>
                  <th style="padding: 10px 12px; text-align: right; color: #4a5568; font-size: 13px; font-weight: bold; border-bottom: 2px solid #cbd5e0; width: 100px;">Đơn giá</th>
                  <th style="padding: 10px 12px; text-align: right; color: #4a5568; font-size: 13px; font-weight: bold; border-bottom: 2px solid #cbd5e0; width: 110px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Tổng kết tiền nong -->
            <div style="margin-left: auto; max-width: 320px; font-size: 14px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #718096; text-align: right;">Tạm tính:</td>
                  <td style="padding: 6px 0; color: #2d3748; text-align: right; width: 120px;">${this.formatCurrency(order.subtotal)}</td>
                </tr>
                ${
                  order.campaign_discount_total > 0
                    ? `
                <tr>
                  <td style="padding: 6px 0; color: #e53e3e; text-align: right;">Khuyến mãi chiến dịch:</td>
                  <td style="padding: 6px 0; color: #e53e3e; text-align: right;">-${this.formatCurrency(order.campaign_discount_total)}</td>
                </tr>`
                    : ''
                }
                ${
                  order.discount_total > 0
                    ? `
                <tr>
                  <td style="padding: 6px 0; color: #e53e3e; text-align: right;">Voucher giảm giá:</td>
                  <td style="padding: 6px 0; color: #e53e3e; text-align: right;">-${this.formatCurrency(order.discount_total)}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 6px 0; color: #718096; text-align: right;">Phí vận chuyển:</td>
                  <td style="padding: 6px 0; color: #2d3748; text-align: right;">${order.shipping_fee > 0 ? this.formatCurrency(order.shipping_fee) : 'Miễn phí'}</td>
                </tr>
                <tr style="border-top: 2px dashed #e2e8f0;">
                  <td style="padding: 12px 0 0 0; color: #2d3748; font-weight: bold; font-size: 16px; text-align: right;">Tổng thanh toán:</td>
                  <td style="padding: 12px 0 0 0; color: #3182ce; font-weight: bold; font-size: 18px; text-align: right;">${this.formatCurrency(order.total_amount)}</td>
                </tr>
              </table>
            </div>

            <!-- Nút liên kết tới trang quản trị (nếu cần thiết) -->
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 30px;">
              <p style="margin-bottom: 15px; font-size: 13px; color: #718096;">Bạn có thể xem chi tiết đơn hàng này trên Dashboard Quản trị viên.</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/orders/${order.order_id}" style="background-color: #3182ce; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);">Xem đơn hàng trên Dashboard</a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7;">
            Đây là email tự động từ hệ thống ShopFS. Vui lòng không trả lời trực tiếp email này.
          </div>
        </div>
      </body>
      </html>
    `;

    // Gửi bất đồng bộ ở background, không đợi await để không block API chính
    this.sendMail({ to, subject, html });
  }

  /**
   * Gửi thông báo hủy đơn hàng cho admin
   * @param {object} order - Chi tiết đơn hàng bị hủy
   * @param {object} user - Chi tiết người hủy đơn
   */
  async sendOrderCancellationNotification(order, user) {
    const adminEmails = await this.getAdminEmails();
    const to = adminEmails.join(', ');
    const subject = `[HỦY ĐƠN HÀNG] Đơn hàng #${order.order_id} đã bị hủy bởi khách hàng`;

    const customerName = user ? `${user.full_name || user.username} (${user.email})` : order.receiver_name;
    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 14px;">
          ${item.product_name_snapshot}
          ${item.size_snapshot || item.color_snapshot ? `<br/><span style="color: #a0aec0; font-size: 12px;">Phân loại: ${[item.size_snapshot, item.color_snapshot].filter(Boolean).join(' / ')}</span>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 14px; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 14px; text-align: right;">
          ${this.formatCurrency(item.unit_price_snapshot)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #718096; font-size: 14px; text-align: right;">
          ${this.formatCurrency(item.line_total)}
        </td>
      </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border-top: 6px solid #e53e3e;">
          
          <!-- Header -->
          <div style="padding: 30px; text-align: center; background-color: #fff5f5;">
            <h1 style="margin: 0; color: #c53030; font-size: 24px; font-weight: 800;">⚠️ ĐƠN HÀNG ĐÃ BỊ HỦY</h1>
            <p style="margin: 5px 0 0 0; color: #742a2a; font-size: 14px;">Mã đơn hàng: <strong>#${order.order_id}</strong> | Ngày hủy: ${new Date().toLocaleString('vi-VN')}</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #2d3748; margin-top: 0;">Xin chào Admin,</p>
            <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
              Hệ thống ghi nhận đơn hàng <strong>#${order.order_id}</strong> của khách hàng <strong>${customerName}</strong> đã được <strong>hủy thành công bởi người dùng</strong>.
            </p>

            <!-- Thông tin đơn hàng đã hủy -->
            <div style="background-color: #fff5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #f56565;">
              <h3 style="margin-top: 0; margin-bottom: 10px; color: #9b2c2c; font-size: 15px;">📋 Tóm tắt đơn hàng bị hủy</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 4px 0; color: #718096; width: 120px;">Khách hàng:</td>
                  <td style="padding: 4px 0; color: #2d3748; font-weight: bold;">${order.receiver_name}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096;">Số điện thoại:</td>
                  <td style="padding: 4px 0; color: #2d3748;">${order.receiver_phone}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096;">Tổng giá trị hủy:</td>
                  <td style="padding: 4px 0; color: #e53e3e; font-weight: bold;">${this.formatCurrency(order.total_amount)}</td>
                </tr>
              </table>
            </div>

            <!-- Chi tiết sản phẩm -->
            <h3 style="margin-top: 0; margin-bottom: 10px; color: #2d3748; font-size: 15px;">🛍️ Danh sách sản phẩm trong đơn</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #f7fafc;">
                  <th style="padding: 10px 12px; text-align: left; color: #718096; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e2e8f0;">Sản phẩm</th>
                  <th style="padding: 10px 12px; text-align: center; color: #718096; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e2e8f0; width: 60px;">SL</th>
                  <th style="padding: 10px 12px; text-align: right; color: #718096; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e2e8f0; width: 100px;">Đơn giá</th>
                  <th style="padding: 10px 12px; text-align: right; color: #718096; font-size: 13px; font-weight: bold; border-bottom: 2px solid #e2e8f0; width: 110px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 30px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/orders/${order.order_id}" style="background-color: #e53e3e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(229, 62, 62, 0.2);">Xem đơn hàng trên Dashboard</a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7;">
            Đây là email tự động từ hệ thống ShopFS. Vui lòng không trả lời trực tiếp email này.
          </div>
        </div>
      </body>
      </html>
    `;

    // Gửi bất đồng bộ ở background, không đợi await để không block API chính
    this.sendMail({ to, subject, html });
  }
}

export default new MailService();
