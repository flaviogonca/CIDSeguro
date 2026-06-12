'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/app';
import { motion } from 'framer-motion';
import {
  BookOpen, Search, Clock, Eye, Filter, X, Tag, ChevronRight,
  Shield, Lock, Smartphone, Users, Building2, AlertTriangle, Wifi
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  views: number;
  featured: boolean;
}

const categories = [
  { id: 'todos', label: 'Todos', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { id: 'phishing', label: 'Phishing', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'senhas', label: 'Senhas', icon: <Lock className="h-3.5 w-3.5" /> },
  { id: 'banco', label: 'Bancário', icon: <Shield className="h-3.5 w-3.5" /> },
  { id: 'redes-sociais', label: 'Redes Sociais', icon: <Smartphone className="h-3.5 w-3.5" /> },
  { id: 'empresas', label: 'Empresas', icon: <Building2 className="h-3.5 w-3.5" /> },
  { id: 'familia', label: 'Família', icon: <Users className="h-3.5 w-3.5" /> },
  { id: 'golpes', label: 'Golpes', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'redes', label: 'Wi-Fi/Redes', icon: <Wifi className="h-3.5 w-3.5" /> },
];

const categoryColors: Record<string, string> = {
  phishing: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  senhas: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  banco: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'redes-sociais': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  empresas: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  familia: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  golpes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  redes: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  geral: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function KnowledgeCenter() {
  const { addPoints, addBadge, incrementArticles } = useAppStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async (cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== 'todos') params.set('category', cat);
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      if (data.success) setArticles(data.articles);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await fetchArticles(selectedCategory);
    };
    load();
    return () => { cancelled = true; };
    }, [selectedCategory]);

  const openArticle = async (article: Article) => {
    setSelectedArticle(article);
    incrementArticles();
    addPoints(5);
    if (articles.filter(a => a.category === article.category).length > 0) {
      addBadge(`📖 ${article.category.charAt(0).toUpperCase() + article.category.slice(1)}`);
    }
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id })
      });
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-foreground">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={i} className="text-base font-semibold mt-4 mb-1.5">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-sm leading-relaxed list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className="ml-4 text-sm leading-relaxed list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.startsWith('✅') || line.startsWith('❌') || line.startsWith('⚠️')) {
        return <p key={i} className="ml-4 text-sm leading-relaxed">{line}</p>;
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-sm leading-relaxed">{line}</p>;
    });
  };

  // Article Detail View
  if (selectedArticle) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="gap-2" onClick={() => setSelectedArticle(null)}>
          <ChevronRight className="h-4 w-4 rotate-180" />
          Voltar aos artigos
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className={categoryColors[selectedArticle.category] || categoryColors.geral}>
                  {selectedArticle.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {selectedArticle.readTime} min de leitura
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {selectedArticle.views + 1} visualizações
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl leading-tight">{selectedArticle.title}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="max-w-3xl">
                {renderMarkdown(selectedArticle.content)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Article List View
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Centro de Conhecimento"
        icon={<BookOpen />}
        title="Biblioteca de Cibersegurança"
        description="Artigos e guias práticos sobre cibersegurança no contexto angolano, organizados por tema."
      />

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar artigos por título ou conteúdo..."
          className="pl-10 pr-10 bg-card border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors">
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 scroll-horizontal pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className={`gap-1.5 shrink-0 press-scale transition-all ${selectedCategory === cat.id ? 'shadow-md shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:border-primary/30'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon}
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Featured */}
      {selectedCategory === 'todos' && !search && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> Artigos em Destaque
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredArticles.filter(a => a.featured).slice(0, 4).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group cursor-pointer border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full glow-hover card-shine"
                  onClick={() => openArticle(article)}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className={`text-[10px] ${categoryColors[article.category] || categoryColors.geral}`}>
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:text-amber-400">⭐ Destaque</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                      {article.content.replace(/[#*\-\n]/g, ' ').substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime} min</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views}</span>
                      <span className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">Ler <ChevronRight className="h-3 w-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="space-y-3">
        {selectedCategory !== 'todos' && (
          <h3 className="text-sm font-semibold text-muted-foreground">
            {filteredArticles.length} artigo(s) encontrado(s)
          </h3>
        )}
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum artigo encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className="group cursor-pointer border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-200"
                onClick={() => openArticle(article)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${categoryColors[article.category] || categoryColors.geral}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {article.category}
                      </Badge>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime} min</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.views}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}