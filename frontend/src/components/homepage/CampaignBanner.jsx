'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
      setT({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0'), expired: false });
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

  const unitStyle = light
    ? { background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }
    : { background: 'rgba(15,68,116,0.10)', backdropFilter: 'blur(6px)' };

  const valueColor = light ? '#ffffff' : 'var(--text-primary)';
  const labelColor = light ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)';
  const sepColor = light ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)';

  if (t.expired) {
    return <span className="text-xs font-medium" style={{ color: light ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>Đã kết thúc</span>;
  }

  const hours = parseInt(t.h, 10);
  const days = Math.floor(hours / 24);
  const remH = String(hours % 24).padStart(2, '0');

  const unitCls = 'flex h-14 w-14 flex-col items-center justify-center rounded-xl';

  return (
    <div className="flex items-center gap-1.5">
      {days > 0 && (
        <>
          <div className={unitCls} style={unitStyle}>
            <span className="text-xl font-bold tabular-nums" style={{ color: valueColor }}>{days}</span>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: labelColor }}>ngày</span>
          </div>
          <span className="text-lg font-bold" style={{ color: sepColor }}>:</span>
        </>
      )}
      <div className={unitCls} style={unitStyle}>
        <span className="text-xl font-bold tabular-nums" style={{ color: valueColor }}>{remH}</span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: labelColor }}>giờ</span>
      </div>
      <span className="text-lg font-bold" style={{ color: sepColor }}>:</span>
      <div className={unitCls} style={unitStyle}>
        <span className="text-xl font-bold tabular-nums" style={{ color: valueColor }}>{t.m}</span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: labelColor }}>phút</span>
      </div>
      <span className="text-lg font-bold" style={{ color: sepColor }}>:</span>
      <div className={unitCls} style={unitStyle}>
        <span className="text-xl font-bold tabular-nums" style={{ color: valueColor }}>{t.s}</span>
        <span className="text-[9px] uppercase tracking-widest" style={{ color: labelColor }}>giây</span>
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

// ─── Left panel (dark — Sky Azure deep gradient) ──────────────────────────────
function LeftPanel({ campaign, reduced }) {
  return (
    <motion.div
      whileHover={reduced ? {} : { y: -3, boxShadow: '0 16px 40px rgba(9,42,80,0.25)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        href={`/campaigns/${campaign.campaign_id}`}
        className="group relative flex h-full items-center justify-between overflow-hidden px-10 py-14 transition-all hover:brightness-105"
        style={{
          background: 'linear-gradient(135deg, var(--sa-950) 0%, var(--sa-800) 60%, var(--sa-700) 100%)',
        }}
      >
        {/* Decorative blobs using sa-* palette */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-64 w-64 rounded-full" style={{ background: 'var(--sa-600)', opacity: 0.15, filter: 'blur(40px)' }} />

        {/* Text side */}
        <div className="relative z-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <TypeIcon type={campaign.campaign_type} />
            {discountLabel(campaign)}
          </span>

          <h2 className="max-w-xs text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
            {campaign.name}
          </h2>

          {campaign.description && (
            <p className="max-w-xs text-sm leading-relaxed text-white/75">{campaign.description}</p>
          )}

          <div className="mt-2">
            <CountdownBlock endDate={campaign.end_date} light />
          </div>

          <span
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all group-hover:bg-white/20"
            style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}
          >
            Xem ngay <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Product thumbnails (up to 3) */}
        {campaign.products?.length > 0 && (
          <div className="relative z-10 hidden shrink-0 lg:flex lg:flex-col lg:gap-3">
            {campaign.products.slice(0, 3).map((p) =>
              p.thumbnail ? (
                <div key={p.product_id} className="h-16 w-16 overflow-hidden rounded-xl shadow-lg" style={{ border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                  <img src={p.thumbnail} alt={p.product_name} className="h-full w-full object-cover" />
                </div>
              ) : null,
            )}
            {campaign.products.length > 3 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)' }}>
                +{campaign.products.length - 3}
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// ─── Right panel gradient pairs (all sa-* derived) ───────────────────────────
// Using mid-range Sky Azure tones so they stay within the design system
const RIGHT_GRADIENTS = [
  'linear-gradient(135deg, var(--sa-600) 0%, var(--sa-400) 100%)',
  'linear-gradient(135deg, var(--sa-700) 0%, var(--sa-500) 100%)',
  'linear-gradient(135deg, var(--sa-800) 0%, var(--sa-600) 100%)',
  'linear-gradient(135deg, var(--sa-500) 0%, var(--sa-300) 100%)',
];

function RightPanel({ campaign, index, reduced }) {
  const gradient = RIGHT_GRADIENTS[index % RIGHT_GRADIENTS.length];

  return (
    <motion.div
      whileHover={reduced ? {} : { y: -3, boxShadow: '0 16px 40px rgba(51,136,216,0.2)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full"
    >
      <Link
        href={`/campaigns/${campaign.campaign_id}`}
        className="group relative flex h-full items-center justify-between overflow-hidden px-10 py-14 transition-all hover:brightness-105"
        style={{ background: gradient }}
      >
        <div className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <div className="pointer-events-none absolute -bottom-10 -right-6 h-56 w-56 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="relative z-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.22)' }}>
            <TypeIcon type={campaign.campaign_type} />
            {discountLabel(campaign)}
          </span>

          <h2 className="max-w-xs text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
            {campaign.name}
          </h2>

          {campaign.description && (
            <p className="max-w-xs text-sm leading-relaxed text-white/85">{campaign.description}</p>
          )}

          <div className="mt-2">
            <CountdownBlock endDate={campaign.end_date} light />
          </div>

          <span
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all group-hover:bg-white/30"
            style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.2)' }}
          >
            Xem ngay <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {campaign.products?.length > 0 && (
          <div className="relative z-10 hidden shrink-0 lg:flex lg:flex-col lg:gap-3">
            {campaign.products.slice(0, 3).map((p) =>
              p.thumbnail ? (
                <div key={p.product_id} className="h-16 w-16 overflow-hidden rounded-xl shadow-lg" style={{ border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)' }}>
                  <img src={p.thumbnail} alt={p.product_name} className="h-full w-full object-cover" />
                </div>
              ) : null,
            )}
            {campaign.products.length > 3 && (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)' }}>
                +{campaign.products.length - 3}
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// ─── Single campaign full-width fallback ──────────────────────────────────────
function SingleCampaignBanner({ campaign, reduced }) {
  return (
    <motion.section
      variants={reduced ? {} : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="w-full"
    >
      <LeftPanel campaign={campaign} reduced={reduced} />
    </motion.section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * CampaignBanner: replaces the static HeroSection2.
 * Receives the sorted active campaigns list; shows top 2 side-by-side.
 * If no campaigns → renders nothing (parent should skip this component).
 */
export default function CampaignBanner({ campaigns = [] }) {
  const reduced = useReducedMotion();

  if (!campaigns || campaigns.length === 0) return null;

  const sorted = [...campaigns].sort((a, b) => {
    const p = { PERCENTAGE: 0, FIXED_PRICE: 0, TIER_DISCOUNT: 1 };
    const pa = p[a.campaign_type] ?? 2;
    const pb = p[b.campaign_type] ?? 2;
    if (pa !== pb) return pa - pb;
    return new Date(a.end_date) - new Date(b.end_date);
  });

  if (sorted.length === 1) return <SingleCampaignBanner campaign={sorted[0]} reduced={reduced} />;

  return (
    <motion.section
      variants={reduced ? {} : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <LeftPanel campaign={sorted[0]} reduced={reduced} />
        <RightPanel campaign={sorted[1]} index={0} reduced={reduced} />
      </div>
    </motion.section>
  );
}
