'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageCircle, ThumbsUp, Send, Plus, Filter,
  Clock, ChevronDown, ChevronUp, AlertTriangle, Lightbulb,
  HelpCircle, Heart
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: string;
}

interface Post {
  id: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
  comments?: Comment[];
}

const postCategories = [
  { id: 'todos', label: 'Todos', color: '' },
  { id: 'alerta', label: '🔔 Alertas', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'dica', label: '💡 Dicas', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: 'pergunta', label: '❓ Perguntas', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'geral', label: '💬 Geral', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
];

export function Community() {
  const { addPoints, addBadge } = useAppStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ authorName: '', title: '', content: '', category: 'geral' });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({ postId: '', authorName: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitPost = async () => {
    if (!newPost.authorName.trim() || !newPost.title.trim() || !newPost.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_post', data: newPost })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setShowNewPost(false);
        setNewPost({ authorName: '', title: '', content: '', category: 'geral' });
        addPoints(15);
        addBadge('📝 Primeiro Post');
      }
    } catch {}
    setSubmitting(false);
  };

  const submitComment = async (postId: string) => {
    if (!newComment.authorName.trim() || !newComment.content.trim()) return;
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_comment',
          data: { postId, authorName: newComment.authorName, content: newComment.content }
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? {
          ...p,
          replies: p.replies + 1,
          comments: [data.comment, ...(p.comments || [])]
        } : p));
        setNewComment({ postId: '', authorName: '', content: '' });
        addPoints(5);
      }
    } catch {}
  };

  const likePost = async (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    addPoints(1);
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like_post', data: { id: postId } })
      });
    } catch {}
  };

  const filteredPosts = selectedCategory === 'todos'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Há ${days}d`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comunidade"
        icon={<Users />}
        title="Espaço da Comunidade"
        description="Partilhe experiências, alerte outros cidadãos e colabore na segurança digital."
        actions={
          <Button onClick={() => setShowNewPost(!showNewPost)} className="btn-premium gap-2 h-9 px-4 rounded-lg">
            <Plus className="h-4 w-4" /> Novo Post
          </Button>
        }
      />

      {/* New Post Form */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Criar Novo Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="O seu nome"
                    value={newPost.authorName}
                    onChange={(e) => setNewPost(p => ({ ...p, authorName: e.target.value }))}
                  />
                  <Select value={newPost.category} onValueChange={(v) => setNewPost(p => ({ ...p, category: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alerta">🔔 Alerta</SelectItem>
                      <SelectItem value="dica">💡 Dica</SelectItem>
                      <SelectItem value="pergunta">❓ Pergunta</SelectItem>
                      <SelectItem value="geral">💬 Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Título do post"
                  value={newPost.title}
                  onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Escreva o seu post... (partilhe alertas, dicas ou faça perguntas sobre cibersegurança)"
                  value={newPost.content}
                  onChange={(e) => setNewPost(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancelar</Button>
                  <Button onClick={submitPost} disabled={submitting} className="gap-2">
                    {submitting ? 'A publicar...' : <><Send className="h-4 w-4" /> Publicar</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {postCategories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className={`shrink-0 ${selectedCategory === cat.id ? '' : 'text-muted-foreground'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum post nesta categoria ainda</p>
              <Button variant="outline" className="mt-3 gap-2" onClick={() => setShowNewPost(true)}>
                <Plus className="h-4 w-4" /> Criar o primeiro post
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="border-border/50 hover:shadow-sm transition-all duration-200 hover:border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {postCategories.find(c => c.id === post.category)?.label || post.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1.5">{post.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 press-scale"
                          onClick={() => likePost(post.id)}
                        >
                          <Heart className="h-3.5 w-3.5" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 press-scale"
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {post.replies} {post.replies === 1 ? 'comentário' : 'comentários'}
                          {expandedPost === post.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>
                      </div>

                      {/* Comments */}
                      <AnimatePresence>
                        {expandedPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Separator className="my-3" />
                            {post.comments && post.comments.length > 0 && (
                              <div className="space-y-3 mb-3">
                                {post.comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold">
                                      {comment.authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold">{comment.authorName}</span>
                                        <span className="text-[10px] text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2 mt-2">
                              <Input
                                placeholder="O seu nome"
                                value={newComment.postId === post.id ? newComment.authorName : ''}
                                onChange={(e) => setNewComment({ postId: post.id, authorName: e.target.value, content: newComment.content })}
                                className="w-28 shrink-0"
                              />
                              <Input
                                placeholder="Escreva um comentário..."
                                value={newComment.postId === post.id ? newComment.content : ''}
                                onChange={(e) => setNewComment({ postId: post.id, authorName: newComment.authorName, content: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newComment.postId === post.id) {
                                    submitComment(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                className="shrink-0"
                                onClick={() => {
                                  setNewComment({ ...newComment, postId: post.id });
                                  submitComment(post.id);
                                }}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}