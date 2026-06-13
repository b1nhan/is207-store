'use client';

import { motion, useReducedMotion } from 'motion/react';

const Footer = () => {
  const reduced = useReducedMotion();

  return (
    <motion.footer
      variants={reduced ? {} : { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      style={{
        background: 'linear-gradient(135deg, var(--sa-950) 0%, var(--sa-900) 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* Brand row */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">
            Shop<span style={{ color: 'var(--sa-300)' }}>FS</span>
          </span>
          <p className="text-sm" style={{ color: 'var(--sa-300)' }}>
            Thời trang hiện đại · Phong cách riêng của bạn
          </p>
        </div>

        {/* Divider */}
        <div
          className="mx-auto mb-6 h-px max-w-xs"
          style={{ background: 'linear-gradient(90deg, transparent, var(--sa-700), transparent)' }}
        />

        {/* Copyright */}
        <p className="text-center text-xs uppercase tracking-widest" style={{ color: 'var(--sa-500)' }}>
          IS207 Phát triển ứng dụng Web · Fashion Store © {new Date().getFullYear()}
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
