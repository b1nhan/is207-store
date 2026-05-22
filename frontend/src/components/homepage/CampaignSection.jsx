'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Tag, Clock, ChevronRight, Zap, Gift, Layers } from 'lucide-react';

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────
function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = new Date(endDate).getTime();

    const calc = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return timeLeft;
}

// ─── Countdown Display ────────────────────────────────────────────────────────
function CountdownDisplay({ endDate }) {
  const t = useCountdown(endDate);
  if (!t) return null;
  if (t.expired) return <span className="text-xs text-red-400 font-medium">Đã kết thúc</span>;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 text-white/90">
      <Clock className="h-3 w-3 shrink-0 text-white/60" />
      {t.days > 0 && (
        <>
          <span className="countdown-unit">{t.days}d</span>
          <span className="text-white/40">:</span>
        </>
      )}
      <span className="countdown-unit">{pad(t.hours)}</span>
      <span className="text-white/40">:</span>
      <span className="countdown-unit">{pad(t.minutes)}</span>
      <span className="text-white/40">:</span>
      <span className="countdown-unit">{pad(t.seconds)}</span>
    </div>
  );
}

// ─── Campaign Type Icon ───────────────────────────────────────────────────────
function CampaignTypeIcon({ type }) {
  const icons = {
    PERCENTAGE: Zap,
    FIXED_PRICE: Tag,
    TIER_DISCOUNT: Layers,
  };
  const Icon = icons[type] || Gift;
  return <Icon className="h-4 w-4" />;
}

// ─── Campaign Type Label ──────────────────────────────────────────────────────
function campaignTypeLabel(type) {
  const labels = {
    PERCENTAGE: 'Giảm %',
    FIXED_PRICE: 'Giảm tiền',
    TIER_DISCOUNT: 'Ưu đãi theo bậc',
  };
  return labels[type] || type;
}

// ─── Discount Summary Text ────────────────────────────────────────────────────
function discountSummary(campaign) {
  if (campaign.campaign_type === 'PERCENTAGE' && campaign.config?.discount_value) {
    return `Giảm ${campaign.config.discount_value}%`;
  }
  if (campaign.campaign_type === 'FIXED_PRICE' && campaign.config?.discount_value) {
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(campaign.config.discount_value)}đ`;
  }
  if (campaign.campaign_type === 'TIER_DISCOUNT' && campaign.tiers?.length > 0) {
    const maxTier = campaign.tiers.reduce((max, t) =>
      t.discount_value > max.discount_value ? t : max,
    );
    return `Giảm đến ${new Intl.NumberFormat('vi-VN').format(maxTier.discount_value)}đ`;
  }
  return '';
}

// ─── Gradient palette per index ───────────────────────────────────────────────
const gradients = [
  'from-rose-500 via-pink-500 to-red-600',
  'from-violet-600 via-purple-500 to-indigo-600',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-blue-600 via-indigo-500 to-violet-600',
  'from-fuchsia-500 via-pink-600 to-rose-600',
];

// ─── Single Campaign Card ─────────────────────────────────────────────────────
function CampaignCard({ campaign, index }) {
  const gradient = gradients[index % gradients.length];
  const summary = discountSummary(campaign);

  return (
    <Link
      href={`/campaigns/${campaign.campaign_id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      id={`campaign-card-${campaign.campaign_id}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute right-4 bottom-12 h-16 w-16 rounded-full bg-white/5" />

      {/* Content */}
      <div className="relative flex flex-col gap-3 p-5">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <CampaignTypeIcon type={campaign.campaign_type} />
            {campaignTypeLabel(campaign.campaign_type)}
          </span>
          {campaign.products?.length > 0 && (
            <span className="text-xs text-white/70">{campaign.products.length} sản phẩm</span>
          )}
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-white drop-shadow-sm">
          {campaign.name}
        </h3>

        {/* Description */}
        {campaign.description && (
          <p className="line-clamp-2 text-sm text-white/80">{campaign.description}</p>
        )}

        {/* Discount highlight */}
        {summary && (
          <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/25 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            <Tag className="h-3.5 w-3.5" />
            {summary}
          </div>
        )}

        {/* Footer: countdown */}
        <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-3">
          <CountdownDisplay endDate={campaign.end_date} />
          <span className="flex items-center gap-1 text-xs font-semibold text-white/90 transition-transform group-hover:translate-x-1">
            Xem ngay <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main CampaignSection ─────────────────────────────────────────────────────
export default function CampaignSection({ campaigns = [] }) {
  if (!campaigns || campaigns.length === 0) return null;

  // Sort: PERCENTAGE/FIXED_PRICE first, then by end_date asc
  const sorted = [...campaigns].sort((a, b) => {
    const priority = { PERCENTAGE: 0, FIXED_PRICE: 0, TIER_DISCOUNT: 1 };
    const pa = priority[a.campaign_type] ?? 2;
    const pb = priority[b.campaign_type] ?? 2;
    if (pa !== pb) return pa - pb;
    return new Date(a.end_date) - new Date(b.end_date);
  });

  return (
    <section className="px-4 py-10" id="campaigns-section">
      <style>{`
        .countdown-unit {
          display: inline-block;
          min-width: 1.25rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* Section header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-text-muted mb-1 text-sm font-medium uppercase tracking-widest">
            Ưu đãi đặc biệt
          </p>
          <h2 className="text-text-primary flex items-center gap-2 text-2xl font-bold">
            <Zap className="h-6 w-6 text-amber-500" />
            Campaign đang diễn ra
          </h2>
        </div>
        <Link
          href="/campaigns"
          className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          Xem tất cả <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 ${
          sorted.length === 1
            ? 'grid-cols-1 max-w-md'
            : sorted.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {sorted.slice(0, 6).map((c, i) => (
          <CampaignCard key={c.campaign_id} campaign={c} index={i} />
        ))}
      </div>
    </section>
  );
}
