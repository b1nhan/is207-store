'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import orderService from '@/services/orderService';
import { authService } from '@/services/authService';
import shippingProfileService from '@/services/shippingProfileService';
import AddShippingProfileModal from '@/components/AddShippingProfileModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  PackageIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  PencilIcon,
  XIcon,
  CheckIcon,
  LoaderIcon,
  MapPinIcon,
  PlusCircleIcon,
  CheckCircle2Icon,
  Trash2Icon,
  RefreshCwIcon,
  Loader2Icon,
} from 'lucide-react';
import { formatDate } from '@/utils/date';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipping: { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: 'Trả hàng', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

// ─── Skeleton loader cho profile list ─────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="border border-border rounded-xl p-4 flex gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-border rounded w-1/3" />
            <div className="h-3 bg-border rounded w-1/4" />
            <div className="h-3 bg-border rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (form.full_name && form.full_name.length > 100) {
      newErrors.full_name = 'Tên tối đa 100 ký tự';
    }
    if (form.phone && !/^0\d{9}$/.test(form.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 số, bắt đầu bằng 0';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.updateProfile({
        full_name: form.full_name || undefined,
        phone: form.phone || undefined,
      });
      onSaved(response.data);
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Cập nhật thất bại. Vui lòng thử lại.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-card-border overflow-hidden"
        style={{ animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <PencilIcon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Chỉnh sửa hồ sơ</h2>
          </div>
          <button
            id="edit-profile-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:bg-border hover:text-text-primary transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Server error */}
          {serverError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Full name */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-full-name"
              className="block text-sm font-medium text-text-primary"
            >
              Tên hiển thị
            </label>
            <input
              id="edit-full-name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nhập tên hiển thị"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-primary bg-background placeholder:text-text-muted outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${errors.full_name
                ? 'border-red-400 focus:border-red-400'
                : 'border-card-border focus:border-primary'
                }`}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="edit-phone"
              className="block text-sm font-medium text-text-primary"
            >
              Số điện thoại
            </label>
            <input
              id="edit-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="0xxxxxxxxx"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-primary bg-background placeholder:text-text-muted outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${errors.phone
                ? 'border-red-400 focus:border-red-400'
                : 'border-card-border focus:border-primary'
                }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              id="edit-profile-save-btn"
              type="submit"
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
// ─── Change Password Modal ───────────────────────────────────────────────────

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.current_password) newErrors.current_password = 'Vui lòng nhập mật khẩu cũ';
    if (!form.new_password) newErrors.new_password = 'Vui lòng nhập mật khẩu mới';
    else if (form.new_password.length < 6) newErrors.new_password = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    if (form.new_password !== form.confirm_password) newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      toast.success('Đổi mật khẩu thành công!');
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-surface w-full max-w-md rounded-2xl shadow-2xl border border-card-border overflow-hidden"
        style={{ animation: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <ShieldCheckIcon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Đổi mật khẩu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:bg-border hover:text-text-primary transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {serverError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Mật khẩu hiện tại
            </label>
            <input
              name="current_password"
              type="password"
              value={form.current_password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu hiện tại"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-primary bg-background placeholder:text-text-muted outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${errors.current_password ? 'border-red-400 focus:border-red-400' : 'border-card-border focus:border-primary'}`}
            />
            {errors.current_password && <p className="text-xs text-red-500">{errors.current_password}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Mật khẩu mới
            </label>
            <input
              name="new_password"
              type="password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-primary bg-background placeholder:text-text-muted outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${errors.new_password ? 'border-red-400 focus:border-red-400' : 'border-card-border focus:border-primary'}`}
            />
            {errors.new_password && <p className="text-xs text-red-500">{errors.new_password}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Xác nhận mật khẩu mới
            </label>
            <input
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu mới"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-text-primary bg-background placeholder:text-text-muted outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${errors.confirm_password ? 'border-red-400 focus:border-red-400' : 'border-card-border focus:border-primary'}`}
            />
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
              {isLoading ? (
                <><LoaderIcon className="w-4 h-4 animate-spin" /> Đang lưu...</>
              ) : (
                <><CheckIcon className="w-4 h-4" /> Xác nhận</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, updateUser } = useAuthStore();
  const { totalItems } = useCartStore();

  const [recentOrders, setRecentOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // ─── Shipping profiles state ─────────────────────────────────────────────────
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState('');
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null); // profile đang edit
  const [deletingId, setDeletingId] = useState(null); // id đang xử lý xóa

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentOrders();
      fetchProfiles();
    }
  }, [isAuthenticated]);

  const fetchRecentOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await orderService.getOrders({ page: 1, limit: 3 });
      setRecentOrders(response.orders || []);
      setTotalOrders(response.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchProfiles = useCallback(async () => {
    setProfilesLoading(true);
    setProfilesError('');
    try {
      const res = await shippingProfileService.getProfiles();
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setProfiles(list);
    } catch {
      setProfilesError('Không thể tải danh sách địa chỉ. Vui lòng thử lại.');
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  const handleProfileSaved = (updatedUser) => {
    updateUser(updatedUser);
  };

  // ─── Shipping profile handlers ───────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingProfile(null);
    setShippingModalOpen(true);
  };

  const handleOpenEdit = (profile) => {
    setEditingProfile(profile);
    setShippingModalOpen(true);
  };

  const handleShippingModalSuccess = (profile) => {
    setShippingModalOpen(false);
    setEditingProfile(null);
    if (editingProfile) {
      // Update existing
      setProfiles((prev) => prev.map((p) => (p.profile_id === profile.profile_id ? profile : p)));
      toast.success('Đã cập nhật địa chỉ!');
    } else {
      // Add new
      setProfiles((prev) => [...prev, profile]);
      toast.success('Đã thêm địa chỉ mới!');
    }
  };

  const handleDelete = async (profileId) => {
    setDeletingId(profileId);
    const toastId = toast.loading('Đang xóa địa chỉ...');
    try {
      await shippingProfileService.deleteProfile(profileId);
      setProfiles((prev) => prev.filter((p) => p.profile_id !== profileId));
      toast.success('Đã xóa địa chỉ!', { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.', { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isInitialized || !isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary">{user?.full_name}</h2>
            <p className="text-text-secondary mt-1">@{user?.username}</p>

            {user?.role === 'ADMIN' && (
              <div className="mt-3 flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                <ShieldCheckIcon className="w-4 h-4" />
                Quản trị viên
              </div>
            )}
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
              <h3 className="text-lg font-semibold text-text-primary">Thông tin liên hệ</h3>
              <div className="flex items-center gap-2">
                <button
                  id="open-change-password-btn"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  Đổi mật khẩu
                </button>
                <button
                  id="open-edit-profile-btn"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  Chỉnh sửa
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <MailIcon className="w-5 h-5 text-primary/70" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Email</p>
                  <p className="text-sm font-medium text-text-primary">{user?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <UserIcon className="w-5 h-5 text-primary/70" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Tên hiển thị</p>
                  <p className="text-sm font-medium text-text-primary">{user?.full_name || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <PhoneIcon className="w-5 h-5 text-primary/70" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Số điện thoại</p>
                  <p className="text-sm font-medium text-text-primary">{user?.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ─── Địa chỉ giao hàng ─── */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-primary" />
                Địa chỉ giao hàng
              </h3>
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <PlusCircleIcon size={16} />
                Thêm địa chỉ
              </button>
            </div>

            {/* Loading */}
            {profilesLoading && <ProfileSkeleton />}

            {/* Error */}
            {!profilesLoading && profilesError && (
              <div className="text-center py-6 space-y-3">
                <p className="text-error text-sm">{profilesError}</p>
                <Button type="button" variant="outline" size="sm" onClick={fetchProfiles}>
                  <RefreshCwIcon size={14} className="mr-1.5" />
                  Thử lại
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!profilesLoading && !profilesError && profiles.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <MapPinIcon className="w-10 h-10 text-text-muted mx-auto" />
                <p className="text-text-secondary text-sm">Bạn chưa có địa chỉ giao hàng nào.</p>
                <Button type="button" variant="outline" size="sm" onClick={handleOpenAdd}>
                  <PlusCircleIcon size={14} className="mr-1.5" />
                  Thêm địa chỉ ngay
                </Button>
              </div>
            )}

            {/* Profile list */}
            {!profilesLoading && !profilesError && profiles.length > 0 && (
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div
                    key={profile.profile_id}
                    className="flex items-start gap-3 border border-border rounded-xl p-4 hover:border-primary/40 transition-all"
                  >
                    {/* Profile info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {profile.label && (
                          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {profile.label}
                          </span>
                        )}
                        {profile.is_default && (
                          <span className="text-xs font-semibold bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2Icon size={11} />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-text-primary mt-1">
                        {profile.receiver_name}
                        <span className="text-text-secondary font-normal ml-2 text-sm">
                          {profile.receiver_phone}
                        </span>
                      </p>
                      <p className="text-text-secondary text-sm mt-0.5 break-words">
                        {profile.full_address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                      <button
                        onClick={() => handleOpenEdit(profile)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <PencilIcon size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.profile_id)}
                        disabled={deletingId === profile.profile_id}
                        title="Xóa"
                        className="p-1.5 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === profile.profile_id
                          ? <Loader2Icon size={15} className="animate-spin" />
                          : <Trash2Icon size={15} />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Thống kê, Địa chỉ & Đơn hàng gần đây */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <PackageIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-text-primary">{isLoadingOrders ? '...' : totalOrders}</p>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="p-4 bg-green-100 rounded-full text-green-600">
                <ShoppingCartIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium">Sản phẩm trong giỏ</p>
                <p className="text-2xl font-bold text-text-primary">{totalItems}</p>
              </div>
            </div>
          </div>

          {/* Đơn hàng gần đây */}
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Đơn hàng gần đây</h3>
              <Button variant="ghost" asChild className="text-primary hover:bg-primary/5">
                <Link href="/orders" className="flex items-center gap-1">
                  Xem tất cả
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {isLoadingOrders ? (
              <div className="flex justify-center items-center py-8 text-text-secondary">
                Đang tải đơn hàng...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                Bạn chưa có đơn hàng nào.
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href="/products">Mua sắm ngay</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };

                  return (
                    <div key={order.order_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border rounded-xl hover:border-primary/30 transition-colors gap-4">
                      <div>
                        <Link href={`/orders/${order.order_id}`} className="font-semibold text-text-primary hover:text-primary transition-colors block mb-1">
                          Đơn hàng #{order.order_id}
                        </Link>
                        <p className="text-sm text-text-secondary">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="font-semibold text-text-primary">
                          {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={handleProfileSaved}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} />
      )}

      {/* Shipping Profile Modal (create / edit) */}
      <AddShippingProfileModal
        isOpen={shippingModalOpen}
        onClose={() => { setShippingModalOpen(false); setEditingProfile(null); }}
        onSuccess={handleShippingModalSuccess}
        initialData={editingProfile}
      />
    </div>
  );
}
