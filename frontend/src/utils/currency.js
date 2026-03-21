export const formatCurrency = (value, currency = 'VND', locale = 'vi-VN') => {
  if (value === null || value === undefined) return '0 ₫';

  // Chuyển đổi chuỗi thành số (để xử lý dữ liệu API trả về dạng "350000.00")
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numberValue)) return '0 ₫';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(numberValue);
};
