'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app';
import { Navigation } from '@/components/cidseguro/Navigation';
import { HeroSection } from '@/components/cidseguro/HeroSection';
import { ChatAssistant } from '@/components/cidseguro/ChatAssistant';
import { LinkScanner } from '@/components/cidseguro/LinkScanner';
import { KnowledgeCenter } from '@/components/cidseguro/KnowledgeCenter';
import { SabiasQue } from '@/components/cidseguro/SabiasQue';
import { Academy } from '@/components/cidseguro/Academy';
import { Community } from '@/components/cidseguro/Community';
import { Helpdesk } from '@/components/cidseguro/Helpdesk';
import { Footer } from '@/components/cidseguro/Footer';

function TabContent() {
  const activeTab = useAppStore((s) => s.activeTab);
  // Animate the tab change with a smooth fade-up
  return (
    <div key={activeTab} className="animate-tab-in">
      {(() => {
        switch (activeTab) {
          case 'inicio': return <HeroSection />;
          case 'assistente': return <ChatAssistant />;
          case 'verificar': return <LinkScanner />;
          case 'conhecimento': return <KnowledgeCenter />;
          case 'sabias': return <SabiasQue />;
          case 'academia': return <Academy />;
          case 'comunidade': return <Community />;
          case 'helpdesk': return <Helpdesk />;
          default: return <HeroSection />;
        }
      })()}
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    fetch('/api/seed', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-mesh relative">
      {/* Soft dot grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          <TabContent />
        </main>
        <Footer />
      </div>
    </div>
  );
}
