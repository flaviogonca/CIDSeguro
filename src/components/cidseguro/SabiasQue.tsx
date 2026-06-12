'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, ThumbsUp, Share2, RefreshCw, Filter,
  Heart, Shield, Lock, Smartphone, Wifi, AlertTriangle, GraduationCap
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  likes: number;
}

const tipCategories = [
  { id: 'todos', label: 'Todas', icon: <Lightbulb className="h-3.5 w-3.5" /> },
  { id: 'senhas', label: 'Senhas', icon: <Lock className="h-3.5 w-3.5" /> },
  { id: 'protecção', label: 'Protecção', icon: <Shield className="h-3.5 w-3.5" /> },
  { id: 'phishing', label: 'Phishing', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'redes', label: 'Redes', icon: <Wifi className="h-3.5 w-3.5" /> },
  { id: 'malware', label: 'Malware', icon: <Smartphone className="h-3.5 w-3.5" /> },
  { id: 'privacidade', label: 'Privacidade', icon: <Lock className="h-3.5 w-3.5" /> },
  { id: 'golpes', label: 'Golpes', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'banco', label: 'Bancário', icon: <Shield className="h-3.5 w-3.5" /> },
  { id: 'actualizações', label: 'Actualizações', icon: <GraduationCap className="h-3.5 w-3.5" /> },
];

export function SabiasQue() {
  const { addPoints, addBadge } = useAppStore();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [likedTips, setLikedTips] = useState<Set<string>>(new Set());
  const [showShareToast, setShowShareToast] = useState(false);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tips');
      const data = await res.json();
      if (data.success) setTips(data.tips);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await fetchTips();
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const likeTip = async (tip: Tip) => {
    if (likedTips.has(tip.id)) return;
    setLikedTips(prev => new Set(prev).add(tip.id));
    setTips(prev => prev.map(t => t.id === tip.id ? { ...t, likes: t.likes + 1 } : t));
    addPoints(2);
    try {
      await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tip.id })
      });
    } catch {}
  };

  const shareTip = (tip: Tip) => {
    const text = `💡 Sabias Que? - CIDSeguro\n\n${tip.title}\n${tip.content}\n\n🛡️ Proteja-se com CIDSeguro`;
    if (navigator.share) {
      navigator.share({ title: 'CIDSeguro - Sabias Que?', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }).catch(() => {});
    }
    addPoints(1);
    addBadge('📤 Partilhador');
  };

  const filteredTips = selectedCategory === 'todos'
    ? tips
    : tips.filter(t => t.category === selectedCategory);

  // Tip of the day
  const todayTip = tips[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dica Diária"
        icon={<Lightbulb />}
        title="Sabias Que?"
        description="Dicas curtas e educativas sobre segurança digital. Aprenda algo novo todos os dias."
        accent="#ffc107"
      />

      {/* Tip of the Day */}
      {todayTip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-transparent overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <CardContent className="p-6 relative">
              <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30">
                <Lightbulb className="h-3 w-3 mr-1" />
                Dica do Dia
              </Badge>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{todayTip.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{todayTip.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{todayTip.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tipCategories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className={`gap-1.5 shrink-0 ${selectedCategory === cat.id ? '' : 'text-muted-foreground'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon}
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-5 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTips.map((tip, i) => (
              <motion.div
                key={tip.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border-border/50 h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1.5">{tip.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1.5 h-7 text-xs ${likedTips.has(tip.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                        onClick={() => likeTip(tip)}
                        disabled={likedTips.has(tip.id)}
                      >
                        <Heart className={`h-3.5 w-3.5 ${likedTips.has(tip.id) ? 'fill-current' : ''}`} />
                        {tip.likes + (likedTips.has(tip.id) ? 1 : 0)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 h-7 text-xs text-muted-foreground"
                        onClick={() => shareTip(tip)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Partilhar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="bg-success text-white border-success">
              <CardContent className="p-3 flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4" />
                Dica copiada para a área de transferência!
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}