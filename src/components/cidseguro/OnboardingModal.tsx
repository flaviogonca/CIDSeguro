'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Shield, MessageSquare, Link2, BookOpen, Lightbulb, GraduationCap,
  Users, Radio, ChevronRight, X, Sparkles, ShieldCheck, Zap, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TabId } from '@/store/app';
import { useAppStore } from '@/store/app';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: <Shield className="h-7 w-7" />,
    title: 'Bem-vindo ao CIDSeguro!',
    desc: 'A sua plataforma inteligente de protecção e consciencialização em cibersegurança, feita para todos os angolanos.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: 'Converse com o nosso Assistente IA',
    desc: 'Tire dúvidas sobre segurança digital a qualquer momento. O nosso chatbot está disponível 24/7.',
    color: 'from-sky-500 to-sky-600',
  },
  {
    icon: <Link2 className="h-7 w-7" />,
    title: 'Verifique links suspeitos',
    desc: 'Antes de clicar num link, use o nosso verificador. A IA analisa e diz-lhe se é seguro.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: <GraduationCap className="h-7 w-7" />,
    title: 'Aprenda e ganhe pontos',
    desc: 'Complete quizzes, leia artigos e participe na comunidade para subir de nível e conquistar badges.',
    color: 'from-violet-500 to-purple-600',
  },
];

const quickStarts: { label: string; icon: React.ReactNode; tab: TabId; desc: string }[] = [
  { label: 'Verificar um Link', icon: <Link2 className="h-4 w-4" />, tab: 'verificar', desc: 'Teste a detecção de phishing' },
  { label: 'Falar com a IA', icon: <MessageSquare className="h-4 w-4" />, tab: 'assistente', desc: 'Tire a sua primeira dúvida' },
  { label: 'Ler um Artigo', icon: <BookOpen className="h-4 w-4" />, tab: 'conhecimento', desc: 'Aprenda algo novo' },
  { label: 'Fazer um Quiz', icon: <GraduationCap className="h-4 w-4" />, tab: 'academia', desc: 'Teste os seus conhecimentos' },
];

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { setActiveTab, addPoints } = useAppStore();

  const handleStart = (tab?: TabId) => {
    addPoints(10);
    onClose();
    if (tab) setActiveTab(tab);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white px-6 py-8">
          <div className="absolute inset-0 cyber-grid opacity-15" />
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20"
            >
              <Shield className="h-8 w-8" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold"
            >
              Bem-vindo ao CIDSeguro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-sm mt-1"
            >
              A sua segurança digital começa aqui 🇦🇴
            </motion.p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Steps */}
          <div className="grid grid-cols-2 gap-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex gap-2.5 items-start"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                  {step.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug">{step.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Começar por aqui
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickStarts.map((qs) => (
                <button
                  key={qs.tab}
                  onClick={() => handleStart(qs.tab)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                    {qs.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-tight">{qs.label}</p>
                    <p className="text-[10px] text-muted-foreground">{qs.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex gap-3"
          >
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Explorar por conta própria
            </Button>
            <Button className="flex-1 gap-2" onClick={() => handleStart('inicio')}>
              <Zap className="h-4 w-4" />
              Começar (+10 pts)
            </Button>
          </motion.div>

          <p className="text-[10px] text-center text-muted-foreground">
            Ganhe pontos ao usar a plataforma • Suba de nível e desbloqueie badges
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}