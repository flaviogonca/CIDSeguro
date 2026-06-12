'use client';

import { useAppStore, type TabId } from '@/store/app';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import {
  Shield, MessageSquare, Link2, BookOpen, Lightbulb, GraduationCap,
  Users, HeadphonesIcon, Menu, Sun, Bell, ChevronRight, Sparkles,
} from 'lucide-react';

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'inicio', label: 'Início', icon: <Shield className="h-4 w-4" /> },
  { id: 'assistente', label: 'Chat', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'verificar', label: 'Scanner', icon: <Link2 className="h-4 w-4" /> },
  { id: 'conhecimento', label: 'Conhecimento', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'sabias', label: 'Sabias Que', icon: <Lightbulb className="h-4 w-4" /> },
  { id: 'academia', label: 'Academia', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'comunidade', label: 'Comunidade', icon: <Users className="h-4 w-4" /> },
  { id: 'helpdesk', label: 'Ajuda', icon: <HeadphonesIcon className="h-4 w-4" /> },
];

export function Navigation() {
  const { activeTab, setActiveTab, points, level, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.success && !cancelled) setNotifications(data.notifications);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-[#1F2937] bg-[#050816]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 h-16">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="relative w-9 h-9 rounded-xl border border-[#00E676]/40 bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/5 flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.1)] transition-transform group-hover:scale-105">
              <Shield className="h-4.5 w-4.5 text-[#00E676]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white/90" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight">
                <span className="text-[#00E676]">CID</span>
                <span className="text-white">Seguro</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#555] mt-0.5">
                Cyber Protection
              </span>
            </div>
          </button>

          {/* Desktop Nav - pill style */}
          <nav className="hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-0.5 p-1 rounded-full bg-[#0B1220] border border-[#1F2937]">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                const isAI = item.id === 'assistente';
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium rounded-full transition-all duration-200 border border-transparent ${
                      active
                        ? (isAI ? 'bg-[#00B8FF]/10 text-[#00B8FF] border-[#00B8FF]/30 shadow-[0_0_10px_rgba(0,184,255,0.1)]' : 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30 shadow-[0_0_10px_rgba(0,230,118,0.1)]')
                        : 'text-[#888] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Points pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1220] border border-[#1F2937] text-[11px]">
              <Sparkles className="h-3 w-3 text-[#00E676]" />
              <span className="text-[#00E676] font-semibold">Nv.{mounted ? level : 1}</span>
              <span className="text-[#444]">•</span>
              <span className="text-[#bbb] font-medium">{mounted ? points : 0} pts</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative h-9 w-9 text-[#888] hover:text-white hover:bg-white/5 rounded-full"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E676] ring-2 ring-[#050816]" />
                )}
              </Button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#1F2937] bg-[#0B1220] shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1F2937]">
                      <div>
                        <p className="text-xs font-semibold text-white">Notificações</p>
                        <p className="text-[10px] text-[#666] mt-0.5">{unreadCount} por ler</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-[#888]" onClick={() => setNotifOpen(false)}>✕</Button>
                    </div>
                    <ScrollArea className="max-h-72">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="h-7 w-7 text-[#333] mx-auto mb-2" />
                          <p className="text-xs text-[#555]">Sem notificações</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#222]">
                          {notifications.map((n: any) => (
                            <div key={n.id} className={`px-4 py-3 hover:bg-white/[0.03] transition-colors ${!n.read ? 'bg-[#00E676]/[0.04]' : ''}`}>
                              <div className="flex items-start gap-2">
                                {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E676]" />}
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-white line-clamp-1">{n.title}</p>
                                  <p className="text-[11px] text-[#777] line-clamp-2 mt-0.5">{n.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle removed - app uses fixed dark mode */}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-[#aaa] hover:text-white hover:bg-white/5 rounded-full">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-[#050816] border-[#1F2937]">
                <div className="p-5 border-b border-[#1F2937]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl border border-[#00E676]/40 bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/5 flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                      <Shield className="h-5 w-5 text-[#00E676]" />
                    </div>
                    <div>
                      <span className="font-bold text-sm"><span className="text-[#00E676]">CID</span><span className="text-white">Seguro</span></span>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#555] mt-0.5">Cyber Protection</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-[#0B1220] border border-[#1F2937]">
                    <Sparkles className="h-3.5 w-3.5 text-[#00E676]" />
                    <span className="text-xs text-[#00E676] font-semibold">Nível {level}</span>
                    <span className="text-[#333]">•</span>
                    <span className="text-xs text-[#bbb]">{points} pts</span>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                  <div className="p-3 space-y-1">
                    {navItems.map((item) => {
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all border border-transparent ${
                            active
                              ? (item.id === 'assistente' ? 'bg-[#00B8FF]/10 text-[#00B8FF] border-[#00B8FF]/30' : 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30')
                              : 'text-[#999] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                          {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
