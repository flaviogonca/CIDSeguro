'use client';

import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Send, Trash2, Bot, User, Shield, Loader2, X
} from 'lucide-react';
import { PageHeader } from './PageHeader';

const quickPrompts = [
  'Como posso proteger a minha conta bancária?',
  'O que é phishing e como me protejo?',
  'Recebi uma mensagem suspeita no WhatsApp',
  'Como criar uma senha forte?',
  'Dicas de segurança para o meu telemóvel',
];

export function ChatAssistant() {
  const { addPoints, addBadge } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState(() => 'session-' + Math.random().toString(36).substr(2, 9));

  const [input, setInput] = useState('');

  const { messages, sendMessage: sdkSendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        sessionId: sessionId
      }
    }),
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Olá! 👋 Sou o **CIDSeguro Bot**, o seu assistente de cibersegurança.

Estou aqui para ajudar a proteger o seu mundo digital:

Como posso ajudar hoje?`
      }
    ],
    onFinish: ({ messages: currentMessages }) => {
      addPoints(3);
      // Badge for first chat
      if (currentMessages.length <= 2) {
        addBadge('💬 Primeira Conversa');
      }
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || (input || '').trim();
    if (!messageText || isLoading) return;

    sdkSendMessage(
      { text: messageText },
      { body: { sessionId: sessionId } }
    );
    if (!text) {
      setInput('');
    }
  };

  const clearChat = async () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Olá! 👋 Sou o **CIDSeguro Bot**, o seu assistente de cibersegurança.

Estou aqui para ajudar a proteger o seu mundo digital:

Como posso ajudar hoje?`
      }
    ]);
    const newSessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);
    try {
      await fetch(`/api/chat?sessionId=${newSessionId}`, { method: 'DELETE' });
    } catch { }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const parts = (content || '').split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') {
        return <br key={i} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Assistente IA"
        icon={<Bot />}
        title="Converse com o CIDSeguro Bot"
        description="Especialista em cibersegurança disponível 24/7 para tirar as suas dúvidas e dar recomendações personalizadas."
        actions={
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/25 text-[11px] text-[#00E676] font-semibold">
            <span className="dot-live" /> Online
          </span>
        }
      />
      <Card className="flex-1 flex flex-col h-[calc(100vh-16rem)] max-h-[760px] border-[#1F2937] bg-[#0B1220] overflow-hidden rounded-2xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
              </div>
              <div>
                <CardTitle className="text-base">Assistente CIDSeguro</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online • Especialista em Cibersegurança</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <div className="hidden sm:flex items-center px-2 py-1 rounded-full bg-primary/5 text-[10px] text-muted-foreground font-medium">
                  {messages.length - 1} mensagens
                </div>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={clearChat} title="Limpar conversa">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gradient-to-b from-transparent to-muted/10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              // AI SDK v6 uses parts array; fall back to content string for compatibility
              const textContent = Array.isArray((msg as any).parts)
                ? (msg as any).parts
                    .filter((p: any) => p.type === 'text')
                    .map((p: any) => p.text)
                    .join('')
                : (msg.content || '');

              if (!textContent && msg.role !== 'user') return null;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user'
                      ? 'bg-secondary border border-border/50'
                      : 'bg-primary/10 border border-primary/20'
                    }`}>
                    {msg.role === 'user'
                      ? <User className="h-4 w-4 text-secondary-foreground" />
                      : <Shield className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md shadow-sm'
                      : 'bg-muted/80 rounded-2xl rounded-tl-md border border-border/30'
                    }`}>
                    {renderContent(textContent)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">A analisar...</span>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">Tópicos Rápidos</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-xs px-3.5 py-2 rounded-full border border-border/80 bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 text-muted-foreground hover:text-primary-foreground press-scale shadow-sm"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-t bg-muted/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input || ''}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua pergunta sobre cibersegurança..."
                disabled={isLoading}
                className="flex-1 pr-10 bg-card border-border/50"
              />
              {(input || '') && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !(input || '').trim()} className="gap-2 shadow-md shadow-primary/20">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-3 mt-2">
            <p className="text-[10px] text-muted-foreground/60">
              ⚡ Powered by IA • Respostas geradas automaticamente
            </p>
            <span className="w-1 h-1 rounded-full bg-border" />
            <p className="text-[10px] text-muted-foreground/60">
              Verifique informações importantes com fontes oficiais
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}