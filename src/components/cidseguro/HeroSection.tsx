'use client';

import { useAppStore } from '@/store/app';
import { Button } from '@/components/ui/button';
import {
  Shield, ArrowRight, Sparkles, Link2, MessageSquare, BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const quickActions = [
  {
    id: 'verificar' as const,
    icon: <Link2 className="h-5 w-5" />,
    title: 'Verificar Link',
    description: 'Analise URLs suspeitos em segundos',
  },
  {
    id: 'assistente' as const,
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Assistente IA',
    description: 'Tire dúvidas com o nosso especialista',
  },
  {
    id: 'conhecimento' as const,
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Aprender',
    description: 'Artigos e dicas de cibersegurança',
  },
];

const stats = [
  { value: '50K+', label: 'Links Analisados' },
  { value: '12K+', label: 'Utilizadores' },
  { value: '98%', label: 'Precisão IA' },
];

export function HeroSection() {
  const { setActiveTab } = useAppStore();

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-[#1F2937] bg-[#050816] px-6 sm:px-12 py-14 sm:py-20 text-center"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full blur-3xl opacity-10"
             style={{ background: 'radial-gradient(circle, #00E676, transparent 65%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
             style={{
               backgroundImage:
                 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
             }} />

        <div className="relative max-w-2xl mx-auto space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl border border-[#00E676]/40 bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/5 flex items-center justify-center shadow-[0_0_20px_-10px_rgba(0,230,118,0.2)]">
                <Shield className="h-9 w-9 text-[#00E676] drop-shadow-[0_0_5px_rgba(0,230,118,0.4)]" />
              </div>
              <span className="dot-live absolute -top-1 -right-1" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00E676]/25 bg-[#00E676]/10"
          >
            <Sparkles className="h-3 w-3 text-[#00E676]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00E676]">
              Plataforma Angolana de Cibersegurança
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-white"
          >
            Proteja o seu{' '}
            <span className="text-[#00E676]">
              mundo digital
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-[#aaa] leading-relaxed max-w-xl mx-auto"
          >
            Ferramentas inteligentes, análise de ameaças em tempo real e
            conteúdos educativos. Tudo num só lugar, feito para si.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Button
              size="lg"
              className="btn-premium gap-2 px-8 h-12 rounded-xl"
              onClick={() => setActiveTab('verificar')}
            >
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="gap-2 px-6 h-12 rounded-xl text-[#ccc] hover:text-white hover:bg-white/5"
              onClick={() => setActiveTab('conhecimento')}
            >
              Explorar Conhecimento
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-[11px] text-[#666]"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00E676]" /> 100% Gratuito
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00E676]" /> Privacy by Design
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#00E676]" /> Suporte 24/7
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats strip */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="surface-2 text-center py-5 px-3"
          >
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-[#888] bg-clip-text text-transparent">
              {s.value}
            </p>
            <p className="text-[11px] sm:text-xs text-[#777] mt-1 uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </motion.section>

      {/* Quick actions */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="section-eyebrow">Comece por aqui</p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Ações rápidas
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              onClick={() => setActiveTab(action.id)}
              className="panel-interactive group p-5 text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676]">
                  {action.icon}
                </div>
                <ArrowRight className="h-4 w-4 text-[#555] group-hover:text-[#00E676] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm font-semibold text-white">{action.title}</p>
              <p className="text-xs text-[#888] mt-1 leading-relaxed">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
