'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tag, Zap, ChevronRight, Layers } from 'lucide-react';

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(endDate) {
  const [t, setT] = useState(null);
  useEffect(() => {
    const target = new Date(endDate).getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ h: '00', m: '00', s: '00', expired: true }); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setT({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        expired: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return t;
}

// ─── Countdown Block ──────────────────────────────────────────────────────────
function CountdownBlock({ endDate, light = false }) {
  const t = useCountdown(endDate);
  if (!t) return null;

  const unitCls = light
    ? 'flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'
    : 'flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-cb-950/10 backdrop-blur-sm';

  const valueCls = `text-xl font-bold tabular-nums ${light ? 'text-white' : 'text-text-primary'}`;
  const labelCls = `text-[9px] uppercase tracking-widest ${light ? 'text-white/60' : 'text-text-muted'}`;
  const sepCls   = `text-lg font-bold ${light ? 'text-white/50' : 'text-text-muted'}`;

  if (t.expired) {
    return (
      <span className={`text-xs font-medium ${light ? 'text-white/60' : 'text-text-muted'}`}>
        Đã kết thúc
      </span>
    );
  }

  const hours = parseInt(t.h, 10);
  const days  = Math.floor(hours / 24);
  const remH  = String(hours % 24).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5">
      {days > 0 && (
        <>
          <div className={unitCls}>
            <span className={valueCls}>{days}</span>
            <span className={labelCls}>ngày</span>
          </div>
          <span className={sepCls}>:</span>
        </>
      )}
      <div className={unitCls}>
        <span className={valueCls}>{remH}</span>
        <span className={labelCls}>giờ</span>
      </div>
      <span className={sepCls}>:</span>
      <div className={unitCls}>
        <span className={valueCls}>{t.m}</span>
        <span className={labelCls}>phút</span>
      </div>
      <span className={sepCls}>:</span>
      <div className={unitCls}>
        <span className={valueCls}>{t.s}</span>
        <span className={labelCls}>giây</span>
      </div>
    </div>
  );
}

// ─── Discount label ───────────────────────────────────────────────────────────
function discountLabel(campaign) {
  if (campaign.campaign_type === 'PERCENTAGE' && campaign.config?.discount_value)
    return `Giảm ${campaign.config.discount_value}%`;
  if (campaign.campaign_type === 'FIXED_PRICE' && campaign.config?.discount_value)
    return `Giảm ${new Intl.NumberFormat('vi-VN').format(campaign.config.discount_value)}đ`;
  if (campaign.campaign_type === 'TIER_DISCOUNT' && campaign.tiers?.length > 0) {
    const max = campaign.tiers.reduce((m, t) => (t.discount_value > m.discount_value ? t : m));
    return `Đến -${new Intl.NumberFormat('vi-VN').format(max.discount_value)}đ`;
  }
  return 'Ưu đãi đặc biệt';
}

function TypeIcon({ type }) {
  if (type === 'PERCENTAGE') return <Zap className="h-4 w-4" />;
  if (type === 'TIER_DISCOUNT') return <Layers className="h-4 w-4" />;
  return <Tag className="h-4 w-4" />;
}

// ─── Left panel (dark gradient) ───────────────────────────────────────────────
function LeftPanel({ campaign }) {
  return (
    <Link
      href={`/campaigns/${campaign.campaign_id}`}
      className="group relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-cb-950 via-cb-900 to-cb-800 px-10 py-14 transition-all hover:brightness-110"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-64 w-64 rounded-full bg-cb-600/20" />

      {/* Text side */}
      <div className="relative z-10 flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <TypeIcon type={campaign.campaign_type} />
          {discountLabel(campaign)}
        </span>

        <h2 className="max-w-xs text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
          {campaign.name}
        </h2>

        {campaign.description && (
          <p className="max-w-xs text-sm leading-relaxed text-white/75">
            {campaign.description}
          </p>
        )}

        <div className="mt-2">
          <CountdownBlock endDate={campaign.end_date} light />
        </div>

        <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all group-hover:bg-white/20">
          Xem ngay <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>

      {/* Product thumbnails (up to 3) */}
      {campaign.products?.length > 0 && (
        <div className="relative z-10 hidden shrink-0 lg:flex lg:flex-col lg:gap-3">
          {campaign.products.slice(0, 3).map((p) =>
            p.thumbnail ? (
              <div
                key={p.product_id}
                className="h-16 w-16 overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 shadow-lg"
              >
                <img src={p.thumbnail} alt={p.product_name} className="h-full w-full object-cover" />
              </div>
            ) : null,
          )}
          {campaign.products.length > 3 && (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white/20 bg-white/10 text-sm font-bold text-white">
              +{campaign.products.length - 3}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

// ─── Right panel (light) ──────────────────────────────────────────────────────
function RightPanel({ campaign, index }) {
  const gradients = [
    'from-rose-400 via-pink-400 to-red-500',
    'from-violet-500 via-purple-400 to-indigo-500',
    'from-amber-400 via-orange-400 to-red-400',
    'from-emerald-400 via-teal-400 to-cyan-500',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <Link
      href={`/campaigns/${campaign.campaign_id}`}
      className={`group relative flex items-center justify-between overflow-hidden bg-gradient-to-br ${gradient} px-10 py-14 transition-all hover:brightness-110`}
    >
      <div className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full bg-white/15" />
      <div className="pointer-events-none absolute -bottom-10 -right-6 h-56 w-56 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <TypeIcon type={campaign.campaign_type} />
          {discountLabel(campaign)}
        </span>

        <h2 className="max-w-xs text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
          {campaign.name}
        </h2>

        {campaign.description && (
          <p className="max-w-xs text-sm leading-relaxed text-white/85">
            {campaign.description}
          </p>
        )}

        <div className="mt-2">
          <CountdownBlock endDate={campaign.end_date} light />
        </div>

        <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl border border-white/40 bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all group-hover:bg-white/30">
          Xem ngay <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>

      {campaign.products?.length > 0 && (
        <div className="relative z-10 hidden shrink-0 lg:flex lg:flex-col lg:gap-3">
          {campaign.products.slice(0, 3).map((p) =>
            p.thumbnail ? (
              <div
                key={p.product_id}
                className="h-16 w-16 overflow-hidden rounded-xl border-2 border-white/30 bg-white/15 shadow-lg"
              >
                <img src={p.thumbnail} alt={p.product_name} className="h-full w-full object-cover" />
              </div>
            ) : null,
          )}
          {campaign.products.length > 3 && (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 text-sm font-bold text-white">
              +{campaign.products.length - 3}
            </div>
          )}
        </div>
      )}
    </Link>
  );
}

// ─── Single campaign full-width fallback ──────────────────────────────────────
function SingleCampaignBanner({ campaign }) {
  return (
    <section className="w-full">
      <LeftPanel campaign={campaign} />
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * CampaignBanner: replaces the static HeroSection2.
 * Receives the sorted active campaigns list; shows top 2 side-by-side.
 * If no campaigns → renders nothing (parent should skip this component).
 */
export default function CampaignBanner({ campaigns = [] }) {
  if (!campaigns || campaigns.length === 0) return null;

  // Sort same as CampaignSection: product discounts first, then end_date asc
  const sorted = [...campaigns].sort((a, b) => {
    const p = { PERCENTAGE: 0, FIXED_PRICE: 0, TIER_DISCOUNT: 1 };
    const pa = p[a.campaign_type] ?? 2;
    const pb = p[b.campaign_type] ?? 2;
    if (pa !== pb) return pa - pb;
    return new Date(a.end_date) - new Date(b.end_date);
  });

  if (sorted.length === 1) return <SingleCampaignBanner campaign={sorted[0]} />;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <LeftPanel campaign={sorted[0]} />
        <RightPanel campaign={sorted[1]} index={0} />
      </div>
    </section>
  );
}
