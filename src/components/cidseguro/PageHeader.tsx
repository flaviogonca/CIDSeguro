'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  icon: ReactNode;
  title: string;
  description?: string;
  accent?: string; // tailwind color e.g. '#00E676'
}

/**
 * Unified page header used by every tab.
 * Provides consistent hierarchy: eyebrow > title > description, with optional
 * action slot on the right and a soft gradient surface for premium feel.
 */
export function PageHeader({
  eyebrow,
  icon,
  title,
  description,
  actions,
  accent = '#00E676',
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mb-6 overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0B1220] px-5 sm:px-6 py-5"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full blur-3xl opacity-25"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="shrink-0 grid h-12 w-12 place-items-center rounded-xl border"
            style={{
              borderColor: `${accent}55`,
              background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
              boxShadow: `0 0 24px ${accent}22`,
            }}
          >
            <span style={{ color: accent }} className="[&_svg]:h-5 [&_svg]:w-5">
              {icon}
            </span>
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                style={{ color: accent }}
              >
                {eyebrow}
              </p>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-[#9a9a9a] max-w-2xl line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        )}
      </div>
    </motion.div>
  );
}
