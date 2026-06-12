'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Target, BookOpen, Trophy, Award, Flame,
  TrendingUp, Zap, Shield, Crown, Lock, Clock, CheckCircle2
} from 'lucide-react';

interface StatsPanelProps {
  onBack: () => void;
}

const ALL_BADGES = [
  { name: 'Primeiro Quiz', emoji: '🎯' },
  { name: 'Primeiro Artigo', emoji: '📖' },
  { name: 'Quiz Master', emoji: '🏆' },
  { name: 'Bom Estudante', emoji: '🎓' },
  { name: 'Aprendiz', emoji: '📚' },
  { name: 'Nível 3', emoji: '⭐' },
  { name: 'Nível 5', emoji: '🌟' },
  { name: 'Nível 7', emoji: '💫' },
  { name: 'Nível 10', emoji: '👑' },
  { name: 'Ponte de Conhecimento', emoji: '🌉' },
  { name: 'Escudo Digital', emoji: '🛡️' },
  { name: 'Fogo na Segurança', emoji: '🔥' },
];

function buildMilestones(badges: string[], quizzesCompleted: number, articlesRead: number, level: number) {
  const milestones: { icon: React.ReactNode; text: string; done: boolean }[] = [];

  if (quizzesCompleted > 0) {
    milestones.push({ icon: <Target className="h-4 w-4" />, text: 'Primeiro Quiz Completado', done: true });
  }
  if (articlesRead > 0) {
    milestones.push({ icon: <BookOpen className="h-4 w-4" />, text: 'Primeiro Artigo Lido', done: true });
  }
  milestones.push({ icon: <TrendingUp className="h-4 w-4" />, text: `Nível ${level} Alcançado`, done: true });

  for (const badge of badges) {
    const match = ALL_BADGES.find(b => b.name === badge);
    milestones.push({
      icon: <Award className="h-4 w-4" />,
      text: `Badge "${badge}" obtido`,
      done: true
    });
  }

  if (quizzesCompleted === 0) {
    milestones.push({ icon: <Target className="h-4 w-4" />, text: 'Complete o primeiro quiz', done: false });
  }
  if (articlesRead === 0) {
    milestones.push({ icon: <BookOpen className="h-4 w-4" />, text: 'Leia o primeiro artigo', done: false });
  }
  if (level < 3) {
    milestones.push({ icon: <Star className="h-4 w-4" />, text: 'Alcance o Nível 3', done: false });
  }

  return milestones;
}

export function StatsPanel({ onBack }: StatsPanelProps) {
  const { points, level, badges, quizzesCompleted, articlesRead } = useAppStore();

  const progressToNext = ((points % 100) / 100) * 100;
  const pointsToNext = 100 - (points % 100);

  // Estimate accuracy based on points and quizzes completed
  // Each correct answer = 15 pts, completion bonus = 25 pts, welcome = 10 pts
  const estimatedCorrect = quizzesCompleted > 0
    ? Math.min(100, Math.round(((points - 10 - quizzesCompleted * 25) / (quizzesCompleted * 75)) * 100))
    : 0;

  const earnedBadges = new Set(badges);

  // Map earned badges to our badge list for display
  const displayBadges = ALL_BADGES.map(b => ({
    ...b,
    earned: earnedBadges.has(b.name) ||
      (b.name === 'Nível 3' && level >= 3) ||
      (b.name === 'Nível 5' && level >= 5) ||
      (b.name === 'Nível 7' && level >= 7) ||
      (b.name === 'Nível 10' && level >= 10)
  }));

  const earnedCount = displayBadges.filter(b => b.earned).length;
  const milestones = buildMilestones(badges, quizzesCompleted, articlesRead, level);

  const levels = Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    threshold: (i + 1) * 100,
    label: i === 0 ? 'Iniciante' : i < 3 ? 'Aprendiz' : i < 5 ? 'Estudioso' : i < 7 ? 'Expert' : i < 9 ? 'Mestre' : 'Lenda',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3Icon className="h-6 w-6 text-primary" />
          Estatísticas Pessoais
        </h2>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors glow-hover h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total de Pontos</p>
                  <p className="text-2xl font-bold text-primary">{points}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Nível {level}</span>
                  <span>{points % 100}/{100}</span>
                </div>
                <Progress value={progressToNext} className="h-2 progress-gradient" />
                <p className="text-[10px] text-muted-foreground text-right">
                  +{pointsToNext} para o nível {level + 1}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors glow-hover h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quizzes Completados</p>
                  <p className="text-2xl font-bold">{quizzesCompleted}</p>
                </div>
              </div>
              {quizzesCompleted > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Precisão estimada</span>
                    <span>{Math.max(0, estimatedCorrect)}%</span>
                  </div>
                  <Progress value={Math.max(0, estimatedCorrect)} className="h-2" />
                </div>
              )}
              {quizzesCompleted === 0 && (
                <p className="text-xs text-muted-foreground">Complete quizzes para ver estatísticas</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors glow-hover h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Artigos Lidos</p>
                  <p className="text-2xl font-bold">{articlesRead}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs text-muted-foreground">
                  {articlesRead > 0 ? `Sequência de ${articlesRead} ${articlesRead === 1 ? 'artigo' : 'artigos'}` : 'Comece a ler para criar sequência'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges Collection */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Colecção de Badges
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {earnedCount}/{ALL_BADGES.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayBadges.map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div
                    className={`relative flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-300 ${
                      badge.earned
                        ? 'bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] glow-hover'
                        : 'bg-muted/30 border-border/50 opacity-50'
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{badge.emoji}</span>
                    <span className="text-[10px] font-medium leading-tight">{badge.name}</span>
                    {badge.earned && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                    )}
                    {!badge.earned && (
                      <div className="absolute -top-1 -right-1">
                        <Lock className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level Progression */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              Progressão de Níveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted hidden sm:block" />
              <div className="flex flex-wrap justify-between gap-4 sm:gap-2">
                {levels.map((lvl) => {
                  const isCurrent = lvl.level === level;
                  const isCompleted = lvl.level < level;
                  const isLocked = lvl.level > level;
                  return (
                    <div key={lvl.level} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 relative z-10 ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                            : isCompleted
                            ? 'bg-primary/10 text-primary border-primary/50'
                            : 'bg-muted/50 text-muted-foreground border-border/50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          lvl.level
                        )}
                      </motion.div>
                      <span className="text-[10px] font-medium">{lvl.label}</span>
                      <span className="text-[9px] text-muted-foreground">{lvl.threshold}pts</span>
                    </div>
                  );
                })}
              </div>
              {/* Current level label */}
              <div className="mt-3 text-center">
                <Badge variant="outline" className="text-xs gap-1">
                  <Zap className="h-3 w-3 text-primary" />
                  Nível Actual: {level} — {points} pontos
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-[#0B1220] border-[#1F2937] hover:bg-[#111827] transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Actividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="relative flex items-start gap-3"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    m.done
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}>
                    {m.done && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>

                  <div className={`flex items-center gap-2 ${m.done ? '' : 'opacity-50'}`}>
                    <div className={m.done ? 'text-primary' : 'text-muted-foreground'}>
                      {m.icon}
                    </div>
                    <span className="text-sm">{m.text}</span>
                    {m.done && (
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Concluído
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}

              {milestones.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Comece a usar a plataforma para ver as suas actividades</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/* Custom icon component for header */
function BarChart3Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
