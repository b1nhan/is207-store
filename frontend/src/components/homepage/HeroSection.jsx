'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { DiaTextReveal } from '../ui/dia-text-reveal';
import { AuroraText } from '../ui/aurora-text';
// ── Shared variants ────────────────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

// ── Shimmer CTA button ─────────────────────────────────────────────────────────
function ShimmerCTA({ href, children }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.04, boxShadow: '0 0 28px var(--sa-400)' }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="relative inline-flex h-[56px] w-[191px] cursor-pointer items-center justify-center overflow-hidden rounded-[6px] text-xl font-medium"
        style={{
          background: 'linear-gradient(135deg, var(--sa-600), var(--sa-800))',
          color: 'var(--primary-foreground)',
        }}
      >
        {/* Shimmer sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            animation: 'hero-shimmer 2.4s ease-in-out infinite',
          }}
        />
        <span className="relative z-10">{children}</span>
      </motion.div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const reduced = useReducedMotion();
  const container = reduced ? {} : staggerContainer;
  const item = reduced ? {} : fadeUp;
  const imgAnim = reduced ? {} : fadeIn;

  return (
    <section
      className="relative flex h-[632px] items-center overflow-hidden"
      style={{
        background: 'linear-gradient(140deg, var(--sa-950) 0%, var(--sa-800) 100%)',
      }}
    >
      {/* ── Ambient orbs ──────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-[480px] w-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--sa-600), transparent 70%)',
          opacity: 0.22,
          filter: 'blur(72px)',
          animation: 'hero-float 9s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-[30%] h-[380px] w-[380px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--sa-400), transparent 70%)',
          opacity: 0.18,
          filter: 'blur(80px)',
          animation: 'hero-float 11s ease-in-out infinite reverse',
          animationDelay: '-4s',
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-shrink-0 items-center justify-between px-16 py-0">

        {/* Text side — stagger entrance */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex-shrink-0 space-y-6"
        >
          <motion.p
            variants={item}
            className="text-[25px] leading-[32px] font-semibold"
            style={{ color: 'var(--sa-300)' }}
          >
            IS207
          </motion.p>

          <motion.h1
            variants={item}
            className="text-8xl font-bold tracking-tight text-white"
          >
            {/* FASHION STORE */}
            <AuroraText>
              FASHION STORE
            </AuroraText>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-[714px] text-[18px] leading-[24px] font-semibold"
            style={{ color: 'var(--sa-200)' }}
          >
            Đồ đẹp vãi lz
          </motion.p>

          <motion.div variants={item}>
            <ShimmerCTA href="/products">Khám phá ngay</ShimmerCTA>
          </motion.div>
        </motion.div>

        {/* Product image — fade in */}
        <motion.div
          variants={imgAnim}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35, duration: 0.7 }}
          className="h-[622px] w-[622px] flex-shrink-0 translate-x-[70px] translate-y-[130px]"
          style={{ filter: 'drop-shadow(0 24px 48px rgba(9,42,80,0.45))' }}
        >
          <img
            src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
            alt="shirt"
            className="h-full w-full object-contain"
          />
        </motion.div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(28px, -28px) scale(1.06); }
          70%       { transform: translate(-18px, 18px) scale(0.96); }
        }
        @keyframes hero-shimmer {
          0%        { transform: translateX(-100%); }
          60%, 100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}

export function HeroSection2() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2">
        <div className="bg-info text-primary-foreground flex items-center justify-between px-16 py-16">
          <img
            src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
            alt="shirt"
            className="h-[420px] w-[380px] -translate-x-[10px] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]"
          />
          <div className="flex min-w-[400px] translate-x-[-50px] flex-col items-end space-y-6 pr-2 text-right">
            <h3 className="text-primary-foreground text-5xl font-bold">Bộ sưu tập mới</h3>
            <p className="text-primary-foreground">
              Những item cực cháy vừa cập bến. Thiết kế độc quyền giúp bạn tự
              tin khẳng định chất riêng không đụng hàng.
            </p>
          </div>
        </div>
        <div className="bg-secondary flex items-center justify-between px-16 py-16">
          <div className="max-w-md space-y-8">
            <div className="leading-none">
              <p className="text-text-primary text-5xl font-extralight">Flash</p>
              <h3 className="text-text-primary -mt-1 text-7xl font-semibold">Sale</h3>
            </div>
            <p className="text-text-primary text-lg leading-relaxed font-bold">
              Giảm giá sập sàn toàn bộ item hot hit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
