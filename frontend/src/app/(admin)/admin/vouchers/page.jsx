'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import adminVoucherService from '@/services/adminVoucherService';
import { Button } from '@/components/ui/button';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await adminVoucherService.getAllVouchers();
      setVouchers(response.data?.vouchers || response.data || []);
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    try {
      await adminVoucherService.deleteVoucher(id);
      fetchVouchers();
    } catch (error) {
      console.error('Failed to delete voucher', error);
      alert('Xóa thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vouchers Management</h1>
        <Link href="/admin/vouchers/new">
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Voucher</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Code</th>
              <th className="p-4 font-semibold text-gray-600">Discount</th>
              <th className="p-4 font-semibold text-gray-600">Min Order Value</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Expiration</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No vouchers found.
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">{voucher.code}</td>
                  <td className="p-4">
                    {voucher.discount_type === 'PERCENT'
                      ? `${voucher.discount_value}%`
                      : `${voucher.discount_value.toLocaleString()}₫`}
                  </td>
                  <td className="p-4">{voucher.min_order_value?.toLocaleString()}₫</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voucher.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {voucher.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(voucher.expiration_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleDelete(voucher.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
