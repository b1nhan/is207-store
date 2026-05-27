'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Ticket, Calendar, Info, RefreshCw } from 'lucide-react';
import voucherService from '@/services/voucherService';
import { toast } from 'sonner';

export default function VouchersSection() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherService.getActiveVouchers();
      if (Array.isArray(res)) {
        setVouchers(res);
      } else if (res && Array.isArray(res.data)) {
        setVouchers(res.data);
      } else {
        setVouchers([]);
      }
    } catch (err) {
      console.error('Error fetching active vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const getDiscountDisplay = (v) => {
    if (v.discount_type === 'PERCENTAGE') {
      return (
        <div className="text-center">
          <div className="text-2xl font-black text-indigo-600">{v.discount_value}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">GIẢM</div>
        </div>
      );
    }
    if (v.discount_type === 'FIXED') {
      const value = v.discount_value >= 1000 ? `${v.discount_value / 1000}k` : v.discount_value;
      return (
        <div className="text-center">
          <div className="text-xl font-black text-emerald-600 uppercase">{value}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">GIẢM</div>
        </div>
      );
    }
    if (v.discount_type === 'FREESHIP') {
      return (
        <div className="text-center">
          <div className="text-lg font-black text-amber-600 uppercase">FREE</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">SHIP</div>
        </div>
      );
    }
    return <Ticket className="h-6 w-6 text-gray-400" />;
  };

  const formatExpiry = (dateStr) => {
    if (!dateStr) return 'Không hết hạn';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Mã giảm giá dành cho bạn</h2>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return null; // Don't show the section if there are no vouchers
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Mã giảm giá (Vouchers)</h2>
        </div>
        <button
          onClick={fetchVouchers}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
          title="Tải lại danh sách"
        >
          <RefreshCw className="h-3 w-3" /> Làm mới
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((v) => {
          const discountDesc = v.description || (
            v.discount_type === 'PERCENTAGE'
              ? `Giảm ${v.discount_value}% tối đa ${v.max_discount_amount ? Number(v.max_discount_amount).toLocaleString('vi-VN') + 'đ' : 'không giới hạn'}`
              : v.discount_type === 'FIXED'
                ? `Giảm ${Number(v.discount_value).toLocaleString('vi-VN')}đ`
                : `Miễn phí vận chuyển`
          );

          const minOrderText = v.min_order_value > 0
            ? `Cho đơn từ ${Number(v.min_order_value).toLocaleString('vi-VN')}đ`
            : 'Mọi đơn hàng';

          return (
            <div
              key={v.voucher_id}
              className="group relative flex bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Ticket Left Part: Badge / Value */}
              <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center bg-gray-50 border-r border-dashed border-gray-200 p-3">
                {getDiscountDisplay(v)}
              </div>

              {/* Decorative Cutouts */}
              <div className="absolute left-[99px] top-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-b border-gray-200 z-10" />
              <div className="absolute left-[99px] bottom-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-background rounded-full border-t border-gray-200 z-10" />

              {/* Ticket Right Part: Description & Code & Copy */}
              <div className="flex-1 flex flex-col p-4 justify-between gap-2 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-250 select-all truncate">
                      {v.code}
                    </span>
                    <button
                      onClick={() => handleCopy(v.code)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        copiedCode === v.code
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent hover:shadow-md'
                      }`}
                    >
                      {copiedCode === v.code ? (
                        <>
                          <Check className="h-3 w-3" /> Đã chép
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">
                    {discountDesc}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-t border-gray-50 pt-2 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1 font-medium text-gray-500">
                    <Info className="h-3 w-3 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{minOrderText}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 flex-shrink-0 text-gray-400" />
                    <span>HSD: {formatExpiry(v.expiry_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
