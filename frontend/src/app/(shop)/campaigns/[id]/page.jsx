import { notFound } from 'next/navigation';
import Link from 'next/link';
import { campaignService } from '@/services/campaignService';
import { ProductCard } from '@/components/product/ProductCard';
import { getBestDiscount } from '@/components/product/DiscountBadge';
import { Tag, Clock, ArrowLeft, Zap, Layers, Gift } from 'lucide-react';

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await campaignService.getCampaignById(id);
    const c = res?.data;
    if (!c) return { title: 'Campaign | Cerulean Blue' };
    return {
      title: `${c.name} | Cerulean Blue`,
      description: c.description || `Ưu đãi ${c.name} đang diễn ra tại Cerulean Blue`,
    };
  } catch {
    return { title: 'Campaign | Cerulean Blue' };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function campaignTypeLabel(type) {
  const map = { PERCENTAGE: 'Giảm theo %', FIXED_PRICE: 'Giảm tiền trực tiếp', TIER_DISCOUNT: 'Ưu đãi theo bậc đơn hàng' };
  return map[type] || type;
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

function discountSummary(campaign) {
  if (campaign.campaign_type === 'PERCENTAGE' && campaign.config?.discount_value) {
    return `Giảm ${campaign.config.discount_value}% cho toàn bộ sản phẩm trong campaign`;
  }
  if (campaign.campaign_type === 'FIXED_PRICE' && campaign.config?.discount_value) {
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(campaign.config.discount_value)}đ cho mỗi sản phẩm`;
  }
  return null;
}

function CampaignTypeIcon({ type }) {
  const icons = { PERCENTAGE: Zap, FIXED_PRICE: Tag, TIER_DISCOUNT: Layers };
  const Icon = icons[type] || Gift;
  return <Icon className="h-5 w-5" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CampaignDetailPage({ params }) {
  const { id } = await params;

  let campaign = null;
  try {
    const res = await campaignService.getCampaignById(id);
    campaign = res?.data;
  } catch (err) {
    console.error('Error fetching campaign:', err);
  }

  if (!campaign) notFound();

  // Xác định discount để truyền xuống ProductCard
  const campaignDiscount = getBestDiscount([campaign]);

  const gradients = {
    PERCENTAGE: 'from-rose-500 via-pink-500 to-red-600',
    FIXED_PRICE: 'from-violet-600 via-purple-500 to-indigo-600',
    TIER_DISCOUNT: 'from-amber-500 via-orange-500 to-red-500',
  };
  const headerGradient = gradients[campaign.campaign_type] || 'from-blue-600 to-indigo-600';

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${headerGradient} py-16`}>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-white/10" />

        <div className="container relative mx-auto max-w-6xl px-4">
          {/* Back */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Link>

          <div className="flex flex-col gap-4">
            {/* Type badge */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <CampaignTypeIcon type={campaign.campaign_type} />
              {campaignTypeLabel(campaign.campaign_type)}
            </span>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white drop-shadow-md">
              {campaign.name}
            </h1>

            {campaign.description && (
              <p className="max-w-xl text-base text-white/85 leading-relaxed">{campaign.description}</p>
            )}

            {/* Discount highlight */}
            {discountSummary(campaign) && (
              <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-2xl bg-white/25 px-5 py-2.5 text-base font-bold text-white backdrop-blur-sm">
                <Tag className="h-4 w-4" />
                {discountSummary(campaign)}
              </div>
            )}

            {/* Time range */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}
              </span>
              {campaign.products?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4" />
                  {campaign.products.length} sản phẩm áp dụng
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tier table (TIER_DISCOUNT) ───────────────────────────────────────── */}
      {campaign.campaign_type === 'TIER_DISCOUNT' && campaign.tiers?.length > 0 && (
        <section className="container mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-text-primary mb-6 text-xl font-bold">Bảng ưu đãi theo bậc</h2>
          <div className="overflow-hidden rounded-2xl border border-amber-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-amber-700">Bậc</th>
                  <th className="px-6 py-3 text-left font-semibold text-amber-700">Giá trị đơn hàng tối thiểu</th>
                  <th className="px-6 py-3 text-left font-semibold text-amber-700">Giảm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50 bg-white">
                {campaign.tiers
                  .sort((a, b) => a.min_order_value - b.min_order_value)
                  .map((tier, i) => (
                    <tr key={tier.tier_id} className="transition-colors hover:bg-amber-50/40">
                      <td className="px-6 py-3 font-medium text-text-primary">Bậc {i + 1}</td>
                      <td className="px-6 py-3 text-text-secondary">
                        Từ {new Intl.NumberFormat('vi-VN').format(tier.min_order_value)}đ
                      </td>
                      <td className="px-6 py-3 font-bold text-amber-600">
                        -{new Intl.NumberFormat('vi-VN').format(tier.discount_value)}đ
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Product listing ──────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-10">
        {campaign.products?.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-text-primary text-xl font-bold">
                Sản phẩm trong campaign
                <span className="text-text-muted ml-2 text-sm font-normal">
                  ({campaign.products.length} sản phẩm)
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {campaign.products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  discount={campaignDiscount}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🎁</div>
            <h3 className="text-xl font-semibold text-text-primary">
              {campaign.campaign_type === 'TIER_DISCOUNT'
                ? 'Ưu đãi áp dụng cho toàn bộ đơn hàng'
                : 'Không có sản phẩm cụ thể'}
            </h3>
            <p className="mt-2 text-text-muted">
              {campaign.campaign_type === 'TIER_DISCOUNT'
                ? 'Campaign này áp dụng ưu đãi dựa trên tổng giá trị đơn hàng của bạn.'
                : 'Campaign này chưa liên kết sản phẩm cụ thể.'}
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-hover"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
