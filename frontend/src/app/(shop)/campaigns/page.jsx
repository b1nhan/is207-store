import Link from 'next/link';
import { campaignService } from '@/services/campaignService';
import { Tag, Clock, ChevronRight, Zap, Layers, Gift } from 'lucide-react';

export const metadata = {
  title: 'Khuyến mãi đang diễn ra | Cerulean Blue',
  description: 'Khám phá tất cả các campaign và ưu đãi đang diễn ra tại Cerulean Blue.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function campaignTypeLabel(type) {
  const map = { PERCENTAGE: 'Giảm %', FIXED_PRICE: 'Giảm tiền', TIER_DISCOUNT: 'Ưu đãi bậc' };
  return map[type] || type;
}

function discountSummary(campaign) {
  if (campaign.campaign_type === 'PERCENTAGE' && campaign.config?.discount_value)
    return `Giảm ${campaign.config.discount_value}%`;
  if (campaign.campaign_type === 'FIXED_PRICE' && campaign.config?.discount_value)
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(campaign.config.discount_value)}đ`;
  if (campaign.campaign_type === 'TIER_DISCOUNT' && campaign.tiers?.length > 0) {
    const max = campaign.tiers.reduce((m, t) => (t.discount_value > m.discount_value ? t : m));
    return `Đến -${new Intl.NumberFormat('vi-VN').format(max.discount_value)}đ`;
  }
  return null;
}

function formatDateRange(start, end) {
  const fmt = (d) =>
    new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
      new Date(d),
    );
  return `${fmt(start)} – ${fmt(end)}`;
}

function CampaignTypeIcon({ type }) {
  const icons = { PERCENTAGE: Zap, FIXED_PRICE: Tag, TIER_DISCOUNT: Layers };
  const Icon = icons[type] || Gift;
  return <Icon className="h-4 w-4" />;
}

const gradients = [
  'from-rose-500 via-pink-500 to-red-600',
  'from-violet-600 via-purple-500 to-indigo-600',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-blue-600 via-indigo-500 to-violet-600',
  'from-fuchsia-500 via-pink-600 to-rose-600',
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CampaignsPage() {
  let campaigns = [];

  try {
    const res = await campaignService.getActiveCampaigns();
    campaigns = res?.data || [];
  } catch (err) {
    console.error('Error fetching campaigns:', err);
  }

  // Sort: product campaigns first, then by end_date
  const sorted = [...campaigns].sort((a, b) => {
    const p = { PERCENTAGE: 0, FIXED_PRICE: 0, TIER_DISCOUNT: 1 };
    const pa = p[a.campaign_type] ?? 2;
    const pb = p[b.campaign_type] ?? 2;
    if (pa !== pb) return pa - pb;
    return new Date(a.end_date) - new Date(b.end_date);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <section className="bg-gradient-to-r from-cb-950 via-cb-900 to-cb-800 py-14">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cb-300">
            Ưu đãi đặc biệt
          </p>
          <h1 className="text-4xl font-bold text-white">Campaign đang diễn ra</h1>
          <p className="mt-3 text-cb-300">
            {sorted.length > 0
              ? `${sorted.length} chương trình ưu đãi đang chờ bạn`
              : 'Hiện chưa có campaign nào đang diễn ra'}
          </p>
        </div>
      </section>

      {/* Campaign grid */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🎁</div>
            <h3 className="text-xl font-semibold text-text-primary">Chưa có campaign nào</h3>
            <p className="mt-2 text-text-muted">Hãy quay lại sau để khám phá các ưu đãi mới!</p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-hover"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c, i) => {
              const summary = discountSummary(c);
              const gradient = gradients[i % gradients.length];

              return (
                <Link
                  key={c.campaign_id}
                  href={`/campaigns/${c.campaign_id}`}
                  id={`campaign-listing-${c.campaign_id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-white/10" />

                  <div className="relative flex flex-1 flex-col gap-4 p-6">
                    {/* Type + product count */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        <CampaignTypeIcon type={c.campaign_type} />
                        {campaignTypeLabel(c.campaign_type)}
                      </span>
                      {c.products?.length > 0 && (
                        <span className="text-xs font-medium text-white/70">
                          {c.products.length} SP
                        </span>
                      )}
                    </div>

                    <h2 className="line-clamp-2 text-xl font-bold leading-snug text-white drop-shadow-sm">
                      {c.name}
                    </h2>

                    {c.description && (
                      <p className="line-clamp-2 text-sm text-white/80">{c.description}</p>
                    )}

                    {/* Discount highlight */}
                    {summary && (
                      <div className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/25 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                        <Tag className="h-3.5 w-3.5" />
                        {summary}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/75">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateRange(c.start_date, c.end_date)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-white/90 transition-transform group-hover:translate-x-1">
                        Chi tiết <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
