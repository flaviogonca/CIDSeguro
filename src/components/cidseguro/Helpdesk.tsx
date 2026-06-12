'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Shield, Link2, ChevronDown, Search, HelpCircle } from 'lucide-react';
import { PageHeader } from './PageHeader';

const faqs = [
  {
    question: 'O que é o CIDSeguro?',
    answer: 'O CIDSeguro é uma plataforma angolana de cibersegurança que oferece ferramentas inteligentes para proteger os seus dados digitais, analisar ameaças e educar sobre segurança online.',
    icon: <Shield className="h-4 w-4" />,
    iconBg: 'bg-[#00E676]',
  },
  {
    question: 'Como funciona o analisador de links?',
    answer: 'O nosso analisador utiliza inteligência artificial para verificar múltiplos indicadores de segurança de um URL, como domínios suspeitos, presença de HTTPS e padrões de phishing. Recebe um relatório detalhado com o nível de risco.',
    icon: <Link2 className="h-4 w-4" />,
    iconBg: 'bg-[#ffc107]',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Aplicamos princípios de Privacy by Design em toda a plataforma. As suas conversas são processadas de forma segura e não armazenamos dados pessoais sensíveis.',
    icon: <Shield className="h-4 w-4" />,
    iconBg: 'bg-[#00E676]',
  },
  {
    question: 'Como ganho pontos e níveis?',
    answer: 'Pode ganhar pontos ao completar quizzes na Academia, ler artigos no Conhecimento, partilhar dicas na Comunidade e muito mais. A cada 100 pontos sobe um nível e desbloqueia novos badges.',
    icon: <HelpCircle className="h-4 w-4" />,
    iconBg: 'bg-[#00E676]',
  },
];

export function Helpdesk() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <PageHeader
        eyebrow="Suporte"
        icon={<HelpCircle />}
        title="Central de Ajuda"
        description="Perguntas frequentes, guias e suporte ao utilizador. Encontre rapidamente o que precisa."
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
        <Input
          placeholder="Pesquisar nas perguntas frequentes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-[#0B1220] border-[#1F2937] rounded-lg text-sm text-white placeholder:text-[#555] focus:border-[#00E676]/40 focus-visible:ring-0"
        />
      </div>

      {/* FAQ List */}
      <div className="rounded-lg border border-[#2a2a2a] overflow-hidden divide-y divide-[#2a2a2a]">
        {filteredFaqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              <div className={`w-7 h-7 rounded-lg ${faq.iconBg} flex items-center justify-center text-white shrink-0`}>
                {faq.icon}
              </div>
              <span className="flex-1 text-[13px] text-[#ddd]">{faq.question}</span>
              <ChevronDown className={`h-4 w-4 text-[#555] shrink-0 transition-transform duration-200 ${expandedFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {expandedFaq === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 pb-3.5 pl-14">
                  <p className="text-[13px] text-[#888] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-[#555]">Nenhum resultado encontrado</p>
        </div>
      )}
    </div>
  );
}