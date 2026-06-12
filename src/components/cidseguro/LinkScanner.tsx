'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Search, Shield, ShieldAlert, ShieldCheck, ShieldX,
  AlertTriangle, CheckCircle, XCircle, Loader2, ExternalLink,
  Info, Eye, Globe, Trash2, History, TrendingUp, Bug,
  Clock, BarChart3
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface AnalysisResult {
  riskLevel: string;
  riskScore: number;
  indicators: string[];
  summary: string;
  recommendations: string[];
  isPhishing: boolean;
  confidence: number;
}

interface ScanHistoryEntry {
  id: string;
  url: string;
  riskLevel: string;
  riskScore: number;
  isPhishing: boolean;
  createdAt: string;
}

const riskConfig: Record<string, { color: string; bg: string; badgeBg: string; borderColor: string; icon: React.ReactNode; label: string }> = {
  baixo: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', borderColor: 'border-l-emerald-500', icon: <ShieldCheck className="h-8 w-8" />, label: 'Baixo Risco' },
  medio: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', borderColor: 'border-l-amber-500', icon: <AlertTriangle className="h-8 w-8" />, label: 'Risco Médio' },
  alto: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', badgeBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', borderColor: 'border-l-orange-500', icon: <ShieldAlert className="h-8 w-8" />, label: 'Alto Risco' },
  critico: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', borderColor: 'border-l-red-500', icon: <ShieldX className="h-8 w-8" />, label: 'Risco Crítico' },
};

const exampleUrls = [
  'https://www.unitel.ao',
  'https://multicaixaexpress.co.ao',
  'https://banco-angolano-seguro.xyz/login',
  'http://prémio-unitel.com/reclamar',
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return 'agora';
  if (diffSec < 60) return `${diffSec}s atrás`;
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHour < 24) return `${diffHour}h atrás`;
  if (diffDay < 7) return `${diffDay}d atrás`;
  return date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' });
}

export function LinkScanner() {
  const { addPoints, addBadge } = useAppStore();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [clearingHistory, setClearingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/scan-history');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch {
      // Silently fail
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const saveToHistory = useCallback(async (scanUrl: string, scanResult: AnalysisResult) => {
    try {
      await fetch('/api/scan-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: scanUrl,
          riskLevel: scanResult.riskLevel,
          riskScore: scanResult.riskScore,
          isPhishing: scanResult.isPhishing,
        }),
      });
      // Refresh history after saving
      fetchHistory();
    } catch {
      // Silently fail - scan result is still shown
    }
  }, [fetchHistory]);

  const clearHistory = useCallback(async () => {
    setClearingHistory(true);
    try {
      await fetch('/api/scan-history', { method: 'DELETE' });
      setHistory([]);
    } catch {
      // Silently fail
    } finally {
      setClearingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const analyzeUrl = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || url.trim();
    if (!targetUrl) return;

    setLoading(true);
    setError('');
    setResult(null);
    setUrl(targetUrl);

    try {
      const res = await fetch('/api/scan-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();

      if (data.success) {
        setResult(data.analysis);
        addPoints(10);
        if (data.analysis.isPhishing) {
          addBadge('🔍 Detetor de Phishing');
        }
        // Save to history
        saveToHistory(targetUrl, data.analysis);
      } else {
        setError(data.error || 'Erro ao analisar o link');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (entry: ScanHistoryEntry) => {
    setUrl(entry.url);
    // Reconstruct a result from the history entry
    setResult({
      riskLevel: entry.riskLevel,
      riskScore: entry.riskScore,
      indicators: ['Dados do histórico — análise completa disponível ao reanalisar'],
      summary: `Entrada do histórico para: ${entry.url}`,
      recommendations: ['Reanalise o link para obter recomendações atualizadas'],
      isPhishing: entry.isPhishing,
      confidence: 0,
    });
    setError('');
  };

  const risk = result ? riskConfig[result.riskLevel] || riskConfig.medio : null;

  // Stats
  const totalScans = history.length;
  const threatsDetected = history.filter((h) => h.isPhishing).length;
  const avgRiskScore = totalScans > 0
    ? Math.round(history.reduce((sum, h) => sum + h.riskScore, 0) / totalScans)
    : 0;

  const showHistory = !loading && !result;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Scanner de Segurança"
        icon={<Link2 />}
        title="Verificador de Links"
        description="Analise qualquer URL antes de clicar. A nossa IA identifica phishing, domínios suspeitos e ameaças em tempo real."
        actions={
          totalScans > 0 ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="pill-muted pill">
                <BarChart3 className="h-3 w-3" /> {totalScans} análises
              </span>
              {threatsDetected > 0 && (
                <span className="pill" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
                  <ShieldAlert className="h-3 w-3" /> {threatsDetected} ameaças
                </span>
              )}
            </div>
          ) : null
        }
      />

      {/* Search Box */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <form
            onSubmit={(e) => { e.preventDefault(); analyzeUrl(); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Cole o URL para analisar... (ex: https://exemplo.com)"
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !url.trim()} className="gap-2 shrink-0 min-w-[140px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'A analisar...' : 'Analisar Link'}
            </Button>
          </form>

          {/* Example URLs */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Experimente com estes exemplos:</p>
            <div className="flex flex-wrap gap-2">
              {exampleUrls.map((exUrl) => (
                <button
                  key={exUrl}
                  onClick={() => analyzeUrl(exUrl)}
                  disabled={loading}
                  className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground border border-border/50"
                >
                  {exUrl.length > 35 ? exUrl.substring(0, 35) + '...' : exUrl}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-primary/20">
            <CardContent className="p-12 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Eye className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="font-semibold">A analisar o link...</p>
                <p className="text-sm text-muted-foreground mt-1">Verificando múltiplos indicadores de segurança</p>
              </div>
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Verificando domínio</span>
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Analizando padrões de phishing</span>
                  <CheckCircle className="h-3 w-3 text-success" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Verificando certificados SSL</span>
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && risk && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Risk Summary */}
            <Card className={`border-2 ${result.riskLevel === 'baixo' ? 'border-emerald-300 dark:border-emerald-700' : result.riskLevel === 'critico' ? 'border-red-300 dark:border-red-700' : 'border-amber-300 dark:border-amber-700'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${risk.bg} ${risk.color} flex items-center justify-center`}>
                    {risk.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={result.riskLevel === 'baixo' ? 'secondary' : result.riskLevel === 'critico' ? 'destructive' : 'outline'} className="text-xs">
                        {risk.label}
                      </Badge>
                      {result.isPhishing && (
                        <Badge variant="destructive" className="text-xs">⚠️ Phishing Detectado</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Nível de Risco</span>
                    <span className={`font-semibold ${risk.color}`}>{result.riskScore}/100</span>
                  </div>
                  <Progress value={result.riskScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Indicators */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Indicadores Encontrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.indicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Confidence */}
            {result.confidence > 0 && (
              <div className="text-center text-xs text-muted-foreground">
                Confiança da análise: {result.confidence}% • Análise gerada por IA • Para questões críticas, consulte um especialista
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan History Section */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Histórico de Análises
                  </CardTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      disabled={clearingHistory}
                      className="text-muted-foreground hover:text-destructive h-8 px-2 text-xs"
                    >
                      {clearingHistory ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                      )}
                      Limpar Histórico
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Stats Bar */}
                {totalScans > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-semibold">{totalScans}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <Bug className="h-4 w-4 text-red-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Ameaças</p>
                        <p className="text-sm font-semibold">{threatsDetected}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                      <TrendingUp className="h-4 w-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Média</p>
                        <p className="text-sm font-semibold">{avgRiskScore}/100</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Loading */}
                {historyLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground ml-2">A carregar histórico...</span>
                  </div>
                )}

                {/* Empty State */}
                {!historyLoading && history.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Nenhuma análise realizada</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Analise um link acima e o resultado aparecerá aqui
                    </p>
                  </div>
                )}

                {/* History List */}
                {!historyLoading && history.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                    {history.map((entry, index) => {
                      const entryRisk = riskConfig[entry.riskLevel] || riskConfig.medio;
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border-l-4 cursor-pointer
                            bg-card border border-border/50 hover:border-primary/30
                            hover:bg-accent/30 transition-all duration-200
                            ${entryRisk.borderColor}
                          `}
                          onClick={() => handleHistoryClick(entry)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleHistoryClick(entry); }}
                          aria-label={`Rever análise de ${entry.url}`}
                        >
                          {/* Risk indicator dot */}
                          <div className={`w-8 h-8 rounded-lg ${entryRisk.bg} ${entryRisk.color} flex items-center justify-center shrink-0`}>
                            <Shield className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{entry.url}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className={`text-[10px] px-1.5 py-0 h-4 font-medium ${entryRisk.badgeBg}`} variant="secondary">
                                {entryRisk.label}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{entry.riskScore}/100</span>
                              {entry.isPhishing && (
                                <span className="text-[10px] text-red-500 font-medium">⚠️ Phishing</span>
                              )}
                            </div>
                          </div>

                          {/* Time */}
                          <div className="text-xs text-muted-foreground shrink-0 text-right">
                            {timeAgo(entry.createdAt)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Como funciona a análise?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm font-medium">Cole o URL</p>
                    <p className="text-xs text-muted-foreground mt-1">Cole qualquer link suspeito que recebeu por mensagem, e-mail ou redes sociais</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm font-medium">IA Analisa</p>
                    <p className="text-xs text-muted-foreground mt-1">O nosso sistema verifica o domínio, padrões de phishing e indicadores de risco</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm font-medium">Recebe o Resultado</p>
                    <p className="text-xs text-muted-foreground mt-1">Obtém uma análise detalhada com o nível de risco e recomendações de segurança</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
