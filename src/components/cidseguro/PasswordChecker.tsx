'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Key, Shield, ShieldCheck, ShieldAlert, ShieldX,
  Copy, Check, Sparkles, AlertTriangle, Info, Clock, Zap,
  CheckCircle2, XCircle, RefreshCw, Lock, Unlock, Trophy,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────── */

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface StrengthResult {
  score: StrengthLevel;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  barColors: string[];
  checks: CheckItem[];
  crackTime: string;
  hasCommonPattern: boolean;
  tips: string[];
}

interface CheckItem {
  label: string;
  met: boolean;
  icon: typeof CheckCircle2;
}

/* ── Common patterns (Angolan context) ─────────────── */

const COMMON_PATTERNS = [
  'password', 'senha', '123456', '12345678', '123456789', '1234567890',
  'qwerty', 'abc123', '111111', '000000', 'abcdef',
  'angola', 'angola2024', 'angola2023', 'angola2025',
  'multicaixa', 'multicaixaexpress', 'unitel', 'movicel',
  'africell', 'luanda', 'bna',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon',
  'master', 'login', 'princess', 'football', 'shadow',
  'sunshine', 'trustno1', 'iloveyou', 'batman', 'access',
  'hello', 'charlie', 'donald', 'password1', 'qwerty123',
];

const ANGOLAN_TIPS = [
  'Não use "angola", "multicaixa", "unitel" ou o seu número de telefone na senha.',
  'Evite anos como "2024" ou "2025" — são demasiado previsíveis.',
  'Não partilhe a sua senha do Multicaixa Express com ninguém.',
  'Use senhas diferentes para cada serviço (banco, redes sociais, e-mail).',
  'Activa a autenticação de dois factores sempre que possível.',
  'Uma frase-senha como "MeuGatoComePeixeEm2024!" é mais fácil de lembrar e difícil de adivinhar.',
  'Cuidado com links falsos do "BNA" ou "Multicaixa" — verifique sempre o endereço.',
  'Nunca envie a sua senha por WhatsApp, SMS ou e-mail.',
];

/* ── Password analysis engine ──────────────────────── */

function analyzePassword(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '#6b7280',
      bgClass: 'bg-muted',
      textClass: 'text-muted-foreground',
      borderClass: 'border-border',
      barColors: ['bg-muted', 'bg-muted', 'bg-muted', 'bg-muted'],
      checks: getDefaultChecks(),
      crackTime: '',
      hasCommonPattern: false,
      tips: [],
    };
  }

  const checks: CheckItem[] = [
    { label: 'Pelo menos 8 caracteres', met: password.length >= 8, icon: CheckCircle2 },
    { label: 'Pelo menos 12 caracteres (ideal)', met: password.length >= 12, icon: CheckCircle2 },
    { label: 'Contém letras maiúsculas (A-Z)', met: /[A-Z]/.test(password), icon: CheckCircle2 },
    { label: 'Contém letras minúsculas (a-z)', met: /[a-z]/.test(password), icon: CheckCircle2 },
    { label: 'Contém números (0-9)', met: /[0-9]/.test(password), icon: CheckCircle2 },
    { label: 'Contém caracteres especiais (!@#$...)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password), icon: CheckCircle2 },
    { label: 'Sem padrões comuns', met: !hasCommonPattern(password), icon: CheckCircle2 },
    { label: 'Sem sequências repetidas (aaa, 111)', met: !/(.)\1{2,}/.test(password), icon: CheckCircle2 },
  ];

  let score: StrengthLevel = 0;
  const metCount = checks.filter(c => c.met).length;

  if (metCount <= 2) score = 1;
  else if (metCount <= 4) score = 2;
  else if (metCount <= 6) score = 3;
  else score = 4;

  // Penalty for short passwords even if they meet some criteria
  if (password.length < 6) score = Math.min(score, 1) as StrengthLevel;
  if (password.length < 4) score = 1;

  // Boost for very long passwords
  if (password.length >= 16 && score < 4) score = Math.min(score + 1, 4) as StrengthLevel;
  if (password.length >= 20 && score < 4) score = 4;

  const configs: Record<StrengthLevel, { label: string; color: string; bgClass: string; textClass: string; borderClass: string; barColors: string[] }> = {
    0: { label: '', color: '#6b7280', bgClass: 'bg-muted', textClass: 'text-muted-foreground', borderClass: 'border-border', barColors: ['bg-muted', 'bg-muted', 'bg-muted', 'bg-muted'] },
    1: { label: 'Fraca', color: '#ef4444', bgClass: 'bg-red-500/10', textClass: 'text-red-500', borderClass: 'border-red-500/30', barColors: ['bg-red-500', 'bg-muted', 'bg-muted', 'bg-muted'] },
    2: { label: 'Razoável', color: '#f97316', bgClass: 'bg-orange-500/10', textClass: 'text-orange-500', borderClass: 'border-orange-500/30', barColors: ['bg-orange-500', 'bg-orange-400', 'bg-muted', 'bg-muted'] },
    3: { label: 'Boa', color: '#eab308', bgClass: 'bg-yellow-500/10', textClass: 'text-yellow-500', borderClass: 'border-yellow-500/30', barColors: ['bg-yellow-500', 'bg-yellow-400', 'bg-yellow-500', 'bg-muted'] },
    4: { label: 'Forte', color: '#10b981', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-500', borderClass: 'border-emerald-500/30', barColors: ['bg-emerald-500', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-400'] },
  };

  const cfg = configs[score];
  const hasCommonPatternFlag = hasCommonPattern(password);

  const tips: string[] = [];
  if (password.length < 12) tips.push('Adicione mais caracteres — idealmente 12 ou mais.');
  if (!/[A-Z]/.test(password)) tips.push('Adicione letras maiúsculas (ex: A, B, C).');
  if (!/[a-z]/.test(password)) tips.push('Adicione letras minúsculas (ex: a, b, c).');
  if (!/[0-9]/.test(password)) tips.push('Adicione números (ex: 3, 7, 9).');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) tips.push('Adicione caracteres especiais (ex: !, @, #, $).');
  if (hasCommonPatternFlag) tips.push('A sua senha contém padrões previsíveis — substitua por combinações únicas.');
  if (/(.)\1{2,}/.test(password)) tips.push('Evite caracteres repetidos (ex: aaa, 111).');

  // Add a random Angolan-specific tip
  if (tips.length > 0) {
    const idx = (password.length) % ANGOLAN_TIPS.length;
    tips.push(ANGOLAN_TIPS[idx]);
  }

  return {
    score,
    ...cfg,
    checks,
    crackTime: estimateCrackTime(password),
    hasCommonPattern: hasCommonPatternFlag,
    tips,
  };
}

function hasCommonPattern(password: string): boolean {
  const lower = password.toLowerCase();
  return COMMON_PATTERNS.some(p => lower.includes(p));
}

function estimateCrackTime(password: string): string {
  if (!password) return '';
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 33;

  if (charset === 0) charset = 26;

  const combinations = Math.pow(charset, password.length);
  const guessesPerSecond = 1e10; // modern GPU
  const seconds = combinations / guessesPerSecond / 2;

  if (seconds < 0.001) return 'Instantâneo';
  if (seconds < 1) return 'Menos de 1 segundo';
  if (seconds < 60) return `${Math.floor(seconds)} segundos`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} horas`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} dias`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} meses`;
  if (seconds < 31536000 * 100) return `${Math.floor(seconds / 31536000)} anos`;
  if (seconds < 31536000 * 1e6) return `${Math.floor(seconds / 31536000).toLocaleString('pt-AO')} anos`;
  if (seconds < 31536000 * 1e9) return 'Milhões de anos';
  if (seconds < 31536000 * 1e12) return 'Biliões de anos';
  return 'Séculos — praticamente impossível';
}

function getDefaultChecks(): CheckItem[] {
  return [
    { label: 'Pelo menos 8 caracteres', met: false, icon: CheckCircle2 },
    { label: 'Pelo menos 12 caracteres (ideal)', met: false, icon: CheckCircle2 },
    { label: 'Contém letras maiúsculas (A-Z)', met: false, icon: CheckCircle2 },
    { label: 'Contém letras minúsculas (a-z)', met: false, icon: CheckCircle2 },
    { label: 'Contém números (0-9)', met: false, icon: CheckCircle2 },
    { label: 'Contém caracteres especiais (!@#$...)', met: false, icon: CheckCircle2 },
    { label: 'Sem padrões comuns', met: false, icon: CheckCircle2 },
    { label: 'Sem sequências repetidas (aaa, 111)', met: false, icon: CheckCircle2 },
  ];
}

function generateStrongPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%^&*_+-=?';

  const all = upper + lower + digits + special;

  // Guarantee at least one of each category
  const guaranteed = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Fill rest randomly (16 total)
  const restLength = 12;
  const rest: string[] = [];
  for (let i = 0; i < restLength; i++) {
    rest.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle all together
  const combined = [...guaranteed, ...rest];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

/* ── Component ─────────────────────────────────────── */

export function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { addPoints, addBadge, badges } = useAppStore();

  const result = useMemo(() => analyzePassword(password), [password]);

  const hasMestreBadge = badges.includes('🔑 Mestre de Senhas');

  const handleGenerate = useCallback(() => {
    const newPassword = generateStrongPassword();
    setPassword(newPassword);
    setShowPassword(true);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = password;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  const handleCheckStrength = useCallback(() => {
    if (result.score >= 4 && !rewarded) {
      addPoints(5);
      setRewarded(true);
    }
    if (result.score >= 4 && !badgeEarned && !hasMestreBadge) {
      addBadge('🔑 Mestre de Senhas');
      setBadgeEarned(true);
    }
  }, [result.score, rewarded, badgeEarned, hasMestreBadge, addPoints, addBadge]);

  const strengthIcon = result.score === 0
    ? <Lock className="h-5 w-5 text-muted-foreground" />
    : result.score <= 1
      ? <ShieldX className="h-5 w-5 text-red-500" />
      : result.score <= 2
        ? <ShieldAlert className="h-5 w-5 text-orange-500" />
        : result.score <= 3
          ? <Shield className="h-5 w-5 text-yellow-500" />
          : <ShieldCheck className="h-5 w-5 text-emerald-500" />;

  return (
    <div className="animate-fade-slide-up space-y-6">
      {/* Section Header */}
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Verificar Senha</h1>
            <p className="text-sm text-muted-foreground">
              Analise a força da sua senha e descubra como melhorá-la
            </p>
          </div>
        </div>
      </div>

      {/* Main Input Card */}
      <Card className="card-shine glow-hover overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            {strengthIcon}
            <span>Insira a sua senha</span>
          </CardTitle>
          <CardDescription>
            A sua senha é analisada localmente — nunca é enviada para qualquer servidor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Password Input */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite a sua senha aqui..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-lg pr-24 font-mono tracking-wide"
              aria-label="Campo de senha"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckStrength();
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {password && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  aria-label="Copiar senha"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Strength Meter */}
          <AnimatePresence mode="wait">
            {password && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {/* Bar segments */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1.5">
                    {result.barColors.map((color, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className={`h-2.5 flex-1 rounded-full ${color} transition-colors duration-500 origin-left`}
                        style={color === 'bg-muted' ? { opacity: 0.3 } : {}}
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={result.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`text-sm font-bold min-w-[70px] text-right ${result.textClass}`}
                    >
                      {result.label}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Crack Time */}
                {result.crackTime && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${result.bgClass} border ${result.borderClass}`}
                  >
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="text-sm">
                      <span className="font-semibold">Tempo estimado para quebrar:</span>{' '}
                      <span className={`font-bold ${result.textClass}`}>{result.crackTime}</span>
                    </span>
                  </motion.div>
                )}

                {/* Check Strength Button */}
                {result.score >= 4 && !rewarded && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={handleCheckStrength}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold gap-2 shadow-lg shadow-emerald-500/25"
                    >
                      <Trophy className="h-4 w-4" />
                      Verificar e Ganhar +5 Pontos
                    </Button>
                  </motion.div>
                )}

                {/* Reward confirmation */}
                <AnimatePresence>
                  {rewarded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        +5 pontos ganhos! A sua senha é forte.
                        {badgeEarned && ' Conquistou o badge 🔑 Mestre de Senhas!'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!password && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Unlock className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Comece a digitar para analisar a força da sua senha
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-column grid for details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Checklist Card */}
        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Critérios de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {result.checks.map((check, i) => (
                      <motion.div
                        key={check.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-300 ${
                          check.met
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/5'
                            : 'bg-muted/50'
                        }`}
                      >
                        {check.met ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={`text-sm transition-colors duration-300 ${
                          check.met
                            ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                            : 'text-muted-foreground'
                        }`}>
                          {check.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary count */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Critérios cumpridos</span>
                      <span className={`text-sm font-bold ${
                        result.checks.filter(c => c.met).length >= 7
                          ? 'text-emerald-500'
                          : result.checks.filter(c => c.met).length >= 4
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}>
                        {result.checks.filter(c => c.met).length} / {result.checks.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips & Generate Card */}
        <AnimatePresence>
          {password ? (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <LightbulbIcon className="h-4 w-4 text-amber-500" />
                    Sugestões de Melhoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.tips.length > 0 ? (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
                      {result.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {tip}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          Senha excelente!
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          A sua senha cumpre todos os critérios de segurança.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Generate strong password */}
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      className="w-full gap-2 h-11"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Gerar Senha Segura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Gerar Senha Segura
                  </CardTitle>
                  <CardDescription>
                    Não consegue pensar numa boa senha? Deixe-nos gerar uma para si.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleGenerate}
                    className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold shadow-lg shadow-primary/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    Gerar Senha Segura
                  </Button>
                  <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-muted/50">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      A senha gerada terá 16 caracteres com maiúsculas, minúsculas, números e símbolos — uma combinação extremamente difícil de adivinhar.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Angolan Context Tips */}
      <Card className="card-shine">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">🇦🇴</span>
            Dicas de Segurança para Angola
          </CardTitle>
          <CardDescription>
            Cuidados específicos para o contexto digital angolano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3 stagger-children">
            {ANGOLAN_TIPS.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors"
              >
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Helper icon component to avoid name collision ── */

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}