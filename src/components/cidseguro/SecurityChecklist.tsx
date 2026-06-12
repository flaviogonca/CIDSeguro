'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/store/app';
import {
  Shield,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Share2,
  Landmark,
  Wifi,
  UsersRound,
  ChevronDown,
  Check,
  Trophy,
  Star,
  Info,
  RotateCcw,
  Sparkles,
  Target,
  Flame,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChecklistItem {
  id: string;
  text: string;
  detail: string;
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: ChecklistItem[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  KeyRound: <KeyRound className="h-5 w-5" />,
  Smartphone: <Smartphone className="h-5 w-5" />,
  Share2: <Share2 className="h-5 w-5" />,
  Landmark: <Landmark className="h-5 w-5" />,
  Wifi: <Wifi className="h-5 w-5" />,
  UsersRound: <UsersRound className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; progress: string; check: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    progress: 'bg-emerald-500',
    check: 'text-emerald-500',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/50',
    text: 'text-sky-600 dark:text-sky-400',
    progress: 'bg-sky-500',
    check: 'text-sky-500',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800/50',
    text: 'text-violet-600 dark:text-violet-400',
    progress: 'bg-violet-500',
    check: 'text-violet-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/50',
    text: 'text-amber-600 dark:text-amber-400',
    progress: 'bg-amber-500',
    check: 'text-amber-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/50',
    text: 'text-rose-600 dark:text-rose-400',
    progress: 'bg-rose-500',
    check: 'text-rose-500',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800/50',
    text: 'text-teal-600 dark:text-teal-400',
    progress: 'bg-teal-500',
    check: 'text-teal-500',
  },
};

const TOTAL_ITEMS = 30;
const STORAGE_KEY = 'cidseguro_checklist';
const BADGE_NAME = '🛡️ Guardião Digital';
const POINTS_PER_ITEM = 2;
const BONUS_ALL_POINTS = 50;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadState(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveState(items: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function getStreakDays(completedItems: string[]): number {
  if (completedItems.length === 0) return 0;
  if (typeof window === 'undefined') return 1;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_first`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_KEY}_first`, new Date().toISOString());
      return 1;
    }
    const first = new Date(raw);
    const now = new Date();
    const diff = Math.max(1, Math.ceil((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.min(diff, 365);
  } catch {
    return 1;
  }
}

/* ------------------------------------------------------------------ */
/*  Progress Ring                                                      */
/* ------------------------------------------------------------------ */

function ProgressRing({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-primary"
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(value)}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground">completo</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Intro Screen                                                       */
/* ------------------------------------------------------------------ */

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        className="relative mb-8"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
          <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        </div>
        <motion.div
          className="absolute -inset-3 rounded-3xl border-2 border-primary/20"
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -inset-6 rounded-3xl border border-primary/10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
        />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-3">
        Lista de Verificação de <span className="text-gradient">Segurança</span>
      </h2>
      <p className="text-muted-foreground max-w-md mb-2 text-sm sm:text-base leading-relaxed">
        Verifique a sua segurança digital em 6 categorias essenciais.
      </p>
      <p className="text-muted-foreground/70 max-w-sm mb-8 text-xs sm:text-sm">
        30 itens de verificação • +2 pontos por item • Badge exclusivo ao completar tudo
      </p>

      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          size="lg"
          className="gap-2 px-8 text-base glow-hover"
          onClick={onStart}
        >
          <ShieldCheck className="h-5 w-5" />
          Começar Verificação
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Congratulations Screen                                             */
/* ------------------------------------------------------------------ */

function CongratsScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        className="relative mb-6"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-amber-400" />
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Parabéns! <span className="text-gradient">Verificação Completa!</span>
      </motion.h2>

      <motion.p
        className="text-muted-foreground max-w-md mb-6 text-sm sm:text-base"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Você completou todos os 30 itens de segurança. Você é agora um verdadeiro <strong className="text-foreground">Guardião Digital</strong>!
      </motion.p>

      <motion.div
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-2xl">🛡️</span>
        <div className="text-left">
          <p className="font-bold text-sm">Guardião Digital</p>
          <p className="text-xs text-muted-foreground">Badge conquistada • +{BONUS_ALL_POINTS} pontos bónus</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4" />
          Refazer Verificação
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Card                                                      */
/* ------------------------------------------------------------------ */

function CategoryCard({
  category,
  completedItems,
  onToggle,
}: {
  category: ChecklistCategory;
  completedItems: string[];
  onToggle: (itemId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const colors = CATEGORY_COLORS[category.color] ?? CATEGORY_COLORS.emerald;
  const completedCount = category.items.filter((i) => completedItems.includes(i.id)).length;
  const isAllDone = completedCount === category.items.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`card-shine border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300 ${isAllDone ? 'opacity-80' : ''}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none py-4 px-4 sm:px-6 hover:bg-accent/20 transition-colors">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
                  {CATEGORY_ICONS[category.icon] ?? <Shield className="h-5 w-5" />}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm sm:text-base">{category.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {completedCount}/{category.items.length} itens
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAllDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-[10px]">
                      <Check className="h-3 w-3 mr-1" />
                      Completo
                    </Badge>
                  </motion.div>
                )}
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        {/* Category progress bar */}
        <div className="px-4 sm:px-6 pb-1">
          <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${colors.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / category.items.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <CollapsibleContent>
          <CardContent className="px-4 sm:px-6 pb-4 pt-3">
            <div className="space-y-2">
              {category.items.map((item, idx) => {
                const isCompleted = completedItems.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30'
                          : 'bg-card/50 border-border/50 hover:border-border hover:bg-card'
                      }`}
                    >
                      <motion.div whileTap={{ scale: 0.9 }} className="mt-0.5">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => onToggle(item.id)}
                          className={isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : ''}
                          aria-label={item.text}
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p
                            className={`text-sm leading-relaxed transition-all duration-300 ${
                              isCompleted
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            {item.text}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="shrink-0 mt-0.5" aria-label={`Detalhes: ${item.text}`}>
                                <Info className={`h-3.5 w-3.5 ${isCompleted ? 'text-muted-foreground/50' : 'text-muted-foreground'}`} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed" sideOffset={8}>
                              {item.detail}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        {isCompleted && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2"
                          >
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Verificado
                            </p>
                          </motion.div>
                        )}
                      </div>
                      {!isCompleted && (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SecurityChecklist() {
  const [started, setStarted] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<ChecklistCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { addPoints, addBadge, badges } = useAppStore();

  // Load checklist data from API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/checklist');
        const data = await res.json();
        if (data.success && !cancelled) {
          setCategories(data.categories);
        }
      } catch {
        // Use fallback data
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load completed items from localStorage
  useEffect(() => {
    const saved = loadState();
    setCompletedItems(saved);
  }, []);

  const handleToggle = useCallback(
    (itemId: string) => {
      setCompletedItems((prev) => {
        const isCurrentlyCompleted = prev.includes(itemId);
        const newItems = isCurrentlyCompleted
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId];

        saveState(newItems);

        // Award points for newly completed items
        if (!isCurrentlyCompleted) {
          addPoints(POINTS_PER_ITEM);

          // Check if all 30 items are now completed
          const allItemIds = categories.flatMap((c) => c.items.map((i) => i.id));
          if (allItemIds.length > 0 && allItemIds.every((id) => newItems.includes(id))) {
            if (!badges.includes(BADGE_NAME)) {
              addBadge(BADGE_NAME);
              addPoints(BONUS_ALL_POINTS);
            }
          }
        }

        // Save to API in background
        fetch('/api/checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedItems: newItems }),
        }).catch(() => {});

        return newItems;
      });
    },
    [addPoints, addBadge, badges, categories]
  );

  const handleReset = useCallback(() => {
    setCompletedItems([]);
    saveState([]);
    setStarted(false);
    fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedItems: [] }),
    }).catch(() => {});
  }, []);

  const completedCount = completedItems.length;
  const remainingCount = TOTAL_ITEMS - completedCount;
  const progressPercent = (completedCount / TOTAL_ITEMS) * 100;
  const isAllDone = completedCount === TOTAL_ITEMS;
  const streakDays = getStreakDays(completedItems);

  // Show intro screen
  if (!started) {
    return (
      <div className="section-header">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Lista de Segurança
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Verifique a sua segurança digital em 30 pontos essenciais
        </p>
        <IntroScreen onStart={() => setStarted(true)} />
      </div>
    );
  }

  // Show congratulations screen
  if (isAllDone) {
    return (
      <div className="section-header">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Lista de Segurança
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Verificação completa
        </p>
        <CongratsScreen onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="section-header">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Lista de Segurança
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verifique a sua segurança digital em 30 pontos essenciais
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 card-shine">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-xl font-bold">{TOTAL_ITEMS}</p>
        </Card>
        <Card className="p-4 card-shine">
          <div className="flex items-center gap-2 mb-1">
            <Check className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Completos</span>
          </div>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </Card>
        <Card className="p-4 card-shine">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Restantes</span>
          </div>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{remainingCount}</p>
        </Card>
        <Card className="p-4 card-shine">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-rose-500" />
            <span className="text-xs text-muted-foreground">Dias</span>
          </div>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{streakDays}</p>
        </Card>
      </motion.div>

      {/* Progress Ring & Overall Progress */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 rounded-2xl border bg-card/50 card-shine gradient-border"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProgressRing value={progressPercent} size={100} strokeWidth={7} />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-base mb-1">Progresso Geral</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {completedCount === 0
              ? 'Comece marcando os itens que já praticou para verificar sua segurança digital.'
              : completedCount < 10
                ? 'Bom começo! Continue verificando mais itens para melhorar sua segurança.'
                : completedCount < 20
                  ? 'Ótimo progresso! Você já está mais protegido que a maioria dos angolanos.'
                  : 'Quase lá! Falta pouco para se tornar um Guardião Digital!'}
          </p>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="flex-1 max-w-xs">
              <Progress value={progressPercent} className="h-2.5 progress-gradient" />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {completedCount}/{TOTAL_ITEMS}
            </span>
          </div>
          {completedCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 justify-center sm:justify-start">
              <Star className="h-3 w-3 text-amber-500" />
              +{completedCount * POINTS_PER_ITEM} pontos ganhos até agora
            </p>
          )}
        </div>
      </motion.div>

      {/* Category Cards */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-40 mb-2" />
                  <div className="h-2 bg-muted rounded w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 stagger-children">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              completedItems={completedItems}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Reset button */}
      {completedCount > 0 && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar Verificação
          </Button>
        </motion.div>
      )}
    </div>
  );
}