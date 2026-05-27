'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Plus, Trash2, Pencil, Search } from 'lucide-react';
import adminVoucherService from '@/services/adminVoucherService';
import VoucherForm from '@/components/admin/VoucherForm';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import { toast } from 'sonner';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [search, setSearch] = useState('');
  const confirm = useConfirm();

  const filteredVouchers = vouchers.filter(v =>
    v.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await adminVoucherService.getAllVouchers();
      // Backend: voucherService.getAll() returns { vouchers, pagination }
      // Axios interceptor unwraps to response.data = { vouchers, pagination }
      setVouchers(response.data?.vouchers || []);
      if (response.data?.pagination) setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Bạn có chắc chắn muốn xóa voucher này?', {
      title: 'Xóa voucher',
      confirmLabel: 'Xóa',
      type: 'danger',
    });
    if (!isConfirmed) return;
    try {
      await adminVoucherService.deleteVoucher(id);
      toast.info(`Đã xóa Voucher ${vouchers.find(v => v.voucher_id === id)?.code || ''}`);
      fetchVouchers();
    } catch (error) {
      console.error('Failed to delete voucher', error);
      toast.error(error.response?.data?.message || error.message || 'Xóa thất bại');
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
      <Breadcrumbs
        root={{ label: 'Admin', href: '/admin' }}
        items={[{ label: 'Voucher' }]}
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản Lý Voucher</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {vouchers.length} voucher
          </p>
        </div>
        <Link href="/admin/vouchers/new">
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Thêm Voucher</span>
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      {!loading && vouchers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Tổng Voucher</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pagination.totalItems || vouchers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đang hoạt động</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {vouchers.filter((v) => v.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đã vô hiệu hóa</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {vouchers.filter((v) => !v.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">Đã hết hạn</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {vouchers.filter((v) => v.expiry_date && new Date(v.expiry_date) < new Date()).length}
            </p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã voucher..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
            {filteredVouchers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No vouchers found.
                </td>
              </tr>
            ) : (
              filteredVouchers.map((voucher) => (
                <tr key={voucher.voucher_id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">{voucher.code}</td>
                  <td className="p-4">
                    {voucher.discount_type === 'PERCENTAGE'
                      ? `${voucher.discount_value}%`
                      : `${Number(voucher.discount_value).toLocaleString('vi-VN')}₫`}
                  </td>
                  <td className="p-4">{Number(voucher.min_order_value).toLocaleString('vi-VN')}₫</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${voucher.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {voucher.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      {voucher.expiry_date && new Date(voucher.expiry_date) < new Date() && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          EXPIRED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {voucher.expiry_date
                      ? new Date(voucher.expiry_date).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(voucher)}>
                      <Pencil size={16} className="text-blue-500" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(voucher.voucher_id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && editingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <h2 className="text-xl font-bold mb-4">Sửa Voucher: {editingVoucher.code}</h2>
            <VoucherForm
              mode="edit"
              initialData={editingVoucher}
              onSuccess={() => {
                setIsEditModalOpen(false);
                setEditingVoucher(null);
                fetchVouchers();
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingVoucher(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
