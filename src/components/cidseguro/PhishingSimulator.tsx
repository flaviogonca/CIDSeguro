'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/app';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish, ShieldCheck, ShieldAlert, ArrowLeft, ArrowRight,
  RotateCcw, Trophy, Clock, Star, CheckCircle, XCircle,
  AlertTriangle, Mail, MessageSquare, Phone, ChevronRight,
  ExternalLink, Eye, Zap, Award, Sparkles
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────

type ScenarioType = 'email' | 'sms' | 'whatsapp';
type Verdict = 'phishing' | 'legitimo';

interface ClueHighlight {
  text: string;
  isRedFlag: boolean;
}

interface Scenario {
  id: number;
  type: ScenarioType;
  sender: string;
  senderAddress: string;
  subject?: string;
  preview: string;
  body: string;
  linkText?: string;
  linkUrl?: string;
  isPhishing: boolean;
  verdict: Verdict;
  explanation: string;
  clues: ClueHighlight[];
}

type GamePhase = 'start' | 'playing' | 'feedback' | 'results';

interface AnswerRecord {
  scenarioId: number;
  userVerdict: Verdict;
  correct: boolean;
  timeTaken: number;
}

// ─── Scenarios Data ───────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  // ── PHISHING (5) ──

  {
    id: 1,
    type: 'sms',
    sender: 'MULTICAIXA EXPRESS',
    senderAddress: '+244 923 456 789',
    preview: 'URGENTE: Sua conta Multicaixa foi bloqueada!',
    body: 'MCX EXPRESS: Sua conta foi BLOQUEADA por tentativas suspeitas. Para desbloquear, acesse imediatamente: http://multicaixa-seguranca.com/verificar. Actue agora para evitar perdas financeiras!',
    linkText: 'http://multicaixa-seguranca.com/verificar',
    linkUrl: 'multicaixa-seguranca.com/verificar',
    isPhishing: true,
    verdict: 'phishing',
    explanation: 'Esta mensagem é PHISHING. A verdadeira Multicaixa Express nunca envia SMS com links para "desbloquear conta". O domínio "multicaixa-seguranca.com" não é oficial — o site verdadeiro é "multicaixaexpress.ao". Além disso, mensagens legítimas nunca criam urgência extrema com letras MAIÚSCULAS.',
    clues: [
      { text: 'Número desconhecido +244 923 456 789', isRedFlag: true },
      { text: 'Uso excessivo de MAIÚSCULAS para criar pânico', isRedFlag: true },
      { text: 'Domínio falso: multicaixa-seguranca.com', isRedFlag: true },
      { text: 'Palavra "URGENTE" para pressionar acção rápida', isRedFlag: true },
    ],
  },
  {
    id: 2,
    type: 'whatsapp',
    sender: 'PROMOÇÃO UNITEL',
    senderAddress: '+244 912 000 111',
    preview: 'Parabéns! Ganhou 500GB de Internet GRÁTIS!',
    body: '🏆 UNITEL PROMOÇÃO ESPECIAL! Você foi seleccionado(a) para ganhar 500GB de internet GRÁTIS por 1 ano! Clique aqui para activar: https://unitel-promo-reward.com/activar-oferta 🎁 Válido por 24h apenas!',
    linkText: 'https://unitel-promo-reward.com/activar-oferta',
    linkUrl: 'unitel-promo-reward.com/activar-oferta',
    isPhishing: true,
    verdict: 'phishing',
    explanation: 'Esta mensagem é PHISHING. A UNITEL não contacta clientes via WhatsApp pessoal com prémios inesperados. O domínio "unitel-promo-reward.com" não pertence à UNITEL. Promoções legítimas são comunicadas via SMS oficial ou aplicação MyUNITEL. O prazo de "24h" é uma tática para impedir verificação.',
    clues: [
      { text: 'Domínio falso: unitel-promo-reward.com', isRedFlag: true },
      { text: 'Prémio demasiado generoso (500GB grátis)', isRedFlag: true },
      { text: 'Pressão temporal: "Válido por 24h apenas"', isRedFlag: true },
      { text: 'Número que não é o oficial da UNITEL', isRedFlag: true },
    ],
  },
  {
    id: 3,
    type: 'email',
    sender: 'INACOM - Instituto Angolano das Comunicações',
    senderAddress: 'notificacao@inacom-gov-angola.net',
    subject: 'AVISO URGENTE: Registro obrigatório de todos os dispositivos',
    preview: 'Caro cidadão, o INACOM exige o registro imediato de todos os seus dispositivos...',
    body: 'Caro(a) Cidadão(ã),\n\nDe acordo com a nova Lei das Comunicações, todos os cidadãos angolanos devem registrar os seus dispositivos electrónicos até 30 dias.\n\nCaso não cumpra, o seu acesso à internet será SUSPENSO imediatamente.\n\nRegistre agora: https://inacom-gov-angola.net/registo-obrigatorio\n\nAtenciosamente,\nDirecção de Fiscalização\nINACOM',
    linkText: 'https://inacom-gov-angola.net/registo-obrigatorio',
    linkUrl: 'inacom-gov-angola.net/registo-obrigatorio',
    isPhishing: true,
    verdict: 'phishing',
    explanation: 'Esta mensagem é PHISHING. O endereço de email "inacom-gov-angola.net" não é oficial — o domínio verdadeiro do INACOM é "inacom.ao". O INACOM nunca ameaça suspender o acesso à internet por email. Comunicações oficiais do governo usam sempre domínios ".ao".',
    clues: [
      { text: 'Domínio falso: inacom-gov-angola.net (não é .ao)', isRedFlag: true },
      { text: 'Ameaça de suspensão de internet', isRedFlag: true },
      { text: 'Email não vem do domínio oficial inacom.ao', isRedFlag: true },
      { text: 'Prazo irrealista de 30 dias para todos os cidadãos', isRedFlag: true },
    ],
  },
  {
    id: 4,
    type: 'email',
    sender: 'Banco de Angola',
    senderAddress: 'seguranca@bna-bancos-angola.com',
    subject: 'Verificação urgente da sua conta bancária - Acção obrigatória',
    preview: 'Detectámos actividade suspeita na sua conta. Verifique agora...',
    body: 'Estimado(a) Cliente,\n\nOs nossos sistemas detectaram uma tentativa de acesso não autorizado à sua conta bancária.\n\nPara proteger os seus fundos, deve verificar a sua identidade em até 12 horas:\n\n👉 https://bna-bancos-angola.com/verificar-identidade\n\nSe não verificar, a sua conta será temporariamente bloqueada.\n\nDepartamento de Segurança\nBanco Nacional de Angola',
    linkText: 'https://bna-bancos-angola.com/verificar-identidade',
    linkUrl: 'bna-bancos-angola.com/verificar-identidade',
    isPhishing: true,
    verdict: 'phishing',
    explanation: 'Esta mensagem é PHISHING. O Banco Nacional de Angola (BNA) é o banco central e não tem contas de clientes individuais. O email vem de "bna-bancos-angola.com" — domínio falso. Bancos angolanos nunca pedem dados via links de email. O BNA comunica via canais oficiais e não por email pessoal.',
    clues: [
      { text: 'BNA não tem clientes individuais (é banco central)', isRedFlag: true },
      { text: 'Domínio falso: bna-bancos-angola.com', isRedFlag: true },
      { text: 'Prazo de 12 horas para criar urgência', isRedFlag: true },
      { text: 'Uso de emoji (👉) em comunicação bancária oficial', isRedFlag: true },
    ],
  },
  {
    id: 5,
    type: 'email',
    sender: 'Recursos Humanos - Chevron Angola',
    senderAddress: 'rh-chevron-angola@careers-oil.com',
    subject: 'Oferta de Emprego: Engenheiro de Petróleo - Salário $8,000/mês',
    preview: 'A Chevron Angola tem o prazer de oferecer-lhe uma posição remunerada...',
    body: 'Prezado(a) Candidato(a),\n\nApós análise do seu currículo na nossa base de dados, a Chevron Angola tem o prazer de oferecer-lhe a posição de Engenheiro(a) de Petróleo Sénior.\n\nDetalhes:\n• Salário: $8,000 USD/mês\n• Alojamento pago em Luanda\n• Voo internacional + vistos\n\nPara aceitar, preencha: https://careers-oil.com/chevron-angola/aceitar\nEnvie cópia do seu BI e passaporte.\n\nRecursos Humanos\nChevron Angola Lda.',
    linkText: 'https://careers-oil.com/chevron-angola/aceitar',
    linkUrl: 'careers-oil.com/chevron-angola/aceitar',
    isPhishing: true,
    verdict: 'phishing',
    explanation: 'Esta mensagem é PHISHING. Ofertas de emprego legítimas da Chevron vêm de "chevron.com" e nunca pedem documentos pessoais (BI, passaporte) por email ou links externos. O domínio "careers-oil.com" não pertence à Chevron. Salários fixos em USD para vagas não solicitadas são um sinal clássico de fraude.',
    clues: [
      { text: 'Domínio falso: careers-oil.com (não é chevron.com)', isRedFlag: true },
      { text: 'Pedido de cópia de BI e passaporte por email', isRedFlag: true },
      { text: 'Oferta não solicitada com salário muito alto', isRedFlag: true },
      { text: 'Email genérico, sem nome pessoal do candidato', isRedFlag: true },
    ],
  },

  // ── LEGITIMATE (5) ──

  {
    id: 6,
    type: 'sms',
    sender: 'EMIS',
    senderAddress: '2020',
    preview: 'Transacção MCX: AOA 15.000,00 no SUPERMERCADO KERO',
    body: 'MCX: Compra de AOA 15.000,00 em SUPERMERCADO KERO - LUANDA com cartão ****4521. Saldo disponível: AOA 185.340,00. Para contestar, contacte o seu banco.',
    isPhishing: false,
    verdict: 'legitimo',
    explanation: 'Esta mensagem é LEGÍTIMA. É uma notificação padrão de transacção Multicaixa Express (EMIS). Vem do número curto oficial 2020, inclui detalhes específicos (valor, comerciante, últimos dígitos do cartão) e não contém nenhum link. Mensagens legítimas do EMIS são informativas e nunca pedem acção urgente com links.',
    clues: [
      { text: 'Número curto oficial 2020 (EMIS)', isRedFlag: false },
      { text: 'Detalhes específicos da transacção (valor, local, cartão)', isRedFlag: false },
      { text: 'Sem links ou pedidos de dados pessoais', isRedFlag: false },
      { text: 'Instrução clara: contacte o banco para contestar', isRedFlag: false },
    ],
  },
  {
    id: 7,
    type: 'whatsapp',
    sender: 'UNITEL Oficial',
    senderAddress: '422',
    preview: 'UNITEL: O seu pacote de 50GB foi renovado com sucesso.',
    body: 'UNITEL: O seu pacote Mensal de 50GB foi renovado com sucesso. Válido até 15/02/2025. Para consultar saldo, digite *121#. Gratidão por escolher a UNITEL! 🇦🇴',
    isPhishing: false,
    verdict: 'legitimo',
    explanation: 'Esta mensagem é LEGÍTIMA. Vem do número oficial da UNITEL (422), confirma uma renovação de pacote (não oferece nada inesperado), inclui data de validade e instrui a verificar saldo via USSD oficial (*121#). A bandeira angolana 🇦🇴 é usada nas comunicações oficiais da UNITEL.',
    clues: [
      { text: 'Número oficial da UNITEL: 422', isRedFlag: false },
      { text: 'Confirma renovação (não oferta surpresa)', isRedFlag: false },
      { text: 'Instrução via USSD oficial: *121#', isRedFlag: false },
      { text: 'Data de validade específica incluída', isRedFlag: false },
    ],
  },
  {
    id: 8,
    type: 'email',
    sender: 'Banco Nacional de Angola',
    senderAddress: 'comunicacao@bna.ao',
    subject: 'Comunicado: Taxa de Referência do BNA mantida em 18,00%',
    preview: 'O Conselho de Administração do BNA decidiu manter a taxa de referência...',
    body: 'Comunicado à Imprensa\n\nLuanda, 25 de Janeiro de 2025\n\nO Conselho de Administração do Banco Nacional de Angola (BNA) informa que, na sua reunião ordinária, deliberou manter a Taxa BNA (TBNA) em 18,00% ao ano.\n\nA decisão tem como objectivo manter a estabilidade macroeconómica e ancorar as expectativas inflacionárias.\n\nPara mais informações, consulte: www.bna.ao\n\nGabinete de Comunicação Institucional\nBanco Nacional de Angola\nAv. 4 de Fevereiro, Luanda',
    linkText: 'www.bna.ao',
    linkUrl: 'bna.ao',
    isPhishing: false,
    verdict: 'legitimo',
    explanation: 'Este email é LEGÍTIMO. Vem do domínio oficial do BNA (bna.ao), é um comunicado público (não pessoal), contém data e localização, endereço físico do BNA em Luanda, e não pede nenhuma acção do destinatário. O tom é informativo e profissional, sem urgência.',
    clues: [
      { text: 'Domínio oficial: bna.ao', isRedFlag: false },
      { text: 'Comunicado público (não dirigido pessoalmente)', isRedFlag: false },
      { text: 'Data, localização e endereço físico incluídos', isRedFlag: false },
      { text: 'Nenhum pedido de dados ou acção urgente', isRedFlag: false },
    ],
  },
  {
    id: 9,
    type: 'email',
    sender: 'INACOM',
    senderAddress: 'comunicacao@inacom.ao',
    subject: 'INACOM lança campanha de sensibilização sobre cibersegurança',
    preview: 'O INACOM informa sobre a campanha nacional de cibersegurança...',
    body: 'INACOM - Instituto Angolano das Comunicações\n\nExmo(a). Senhor(a),\n\nO INACOM tem a honra de informar que foi lançada a Campanha Nacional de Sensibilização em Cibersegurança "Angola Digital Segura 2025".\n\nA campanha inclui:\n• Workshops gratuitos nas 18 províncias\n• Conteúdo educativo em português e línguas nacionais\n• Aplicação móvel de verificação de links\n\nSaiba mais em: www.inacom.ao/ciberseguranca2025\n\nCom os melhores cumprimentos,\nGabinete de Comunicação\nINACOM\nAv. Pedro de Castro Van-Dúnem Loy, Luanda',
    linkText: 'www.inacom.ao/ciberseguranca2025',
    linkUrl: 'inacom.ao/ciberseguranca2025',
    isPhishing: false,
    verdict: 'legitimo',
    explanation: 'Este email é LEGÍTIMO. Vem do domínio oficial do INACOM (inacom.ao), é um anúncio de campanha pública (não pessoal), contém detalhes específicos e verificáveis, endereço físico em Luanda, e o link aponta para o domínio oficial. O tom é informativo sem pressão.',
    clues: [
      { text: 'Domínio oficial: inacom.ao', isRedFlag: false },
      { text: 'Campanha pública com detalhes específicos', isRedFlag: false },
      { text: 'Link aponta para domínio oficial inacom.ao', isRedFlag: false },
      { text: 'Endereço físico e identidade institucional completos', isRedFlag: false },
    ],
  },
  {
    id: 10,
    type: 'email',
    sender: 'Emprego Angola',
    senderAddress: 'notificacoes@empregoangola.co.ao',
    subject: 'Nova vaga de emprego corresponde ao seu perfil',
    preview: 'Encontrámos 3 vagas que correspondem às suas qualificações...',
    body: 'Olá, Maria!\n\nTemos 3 novas vagas que correspondem ao seu perfil de Analista de Sistemas:\n\n1. Analista de Sistemas Sénior - Empresa de Telecomunicações (Luanda)\n   Salário: AOA 350.000 - 500.000/mês\n\n2. Desenvolvedor(a) Full Stack - Banco Comercial (Luanda)\n   Salário: AOA 400.000 - 600.000/mês\n\n3. IT Project Manager - Empresa de Mineração (Cabinda)\n   Salário: AOA 550.000 - 750.000/mês\n\nPara ver detalhes e candidatar-se, acesse: www.empregoangola.co.ao/vagas/analista-sistemas\n\nEquipa Emprego Angola\nAv. Laurinda Cardoso, 15 - Luanda',
    linkText: 'www.empregoangola.co.ao/vagas/analista-sistemas',
    linkUrl: 'empregoangola.co.ao/vagas/analista-sistemas',
    isPhishing: false,
    verdict: 'legitimo',
    explanation: 'Este email é LEGÍTIMA. Vem do domínio oficial do portal (empregoangola.co.ao), usa o nome pessoal do utilizador, apresenta vagas realistas com salários em Kwanzas (não USD), não pede documentos por email e o link aponta para o domínio oficial. O endereço físico em Luanda está incluído.',
    clues: [
      { text: 'Domínio oficial: empregoangola.co.ao', isRedFlag: false },
      { text: 'Usa nome pessoal do utilizador', isRedFlag: false },
      { text: 'Salários em Kwanzas (AOA) — realistas para Angola', isRedFlag: false },
      { text: 'Link aponta para o portal oficial', isRedFlag: false },
    ],
  },
];

// ─── Confetti Particle ───────────────────────────────────────────────

function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-sm pointer-events-none"
      style={{ backgroundColor: color, top: -10, left: `${Math.random() * 100}%` }}
      initial={{ y: -10, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 400],
        opacity: [1, 1, 0],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{ duration: 2.5, delay, ease: 'easeIn' }}
    />
  );
}

// ─── Email Card UI ────────────────────────────────────────────────────

function EmailCard({ scenario, showClues }: { scenario: Scenario; showClues: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      {/* Email Header */}
      <div className="border-b border-border/60 px-4 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            De: <span className={showClues && scenario.isPhishing ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1 rounded font-mono text-xs' : 'font-mono text-xs text-foreground'}>{scenario.senderAddress}</span>
          </span>
          <span className="text-[10px] text-muted-foreground">Hoje, 14:32</span>
        </div>
        {scenario.subject && (
          <p className="text-sm font-semibold text-foreground leading-snug">{scenario.subject}</p>
        )}
        <p className="text-xs text-muted-foreground truncate">{scenario.preview}</p>
      </div>
      {/* Email Body */}
      <div className="p-4">
        <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
          {scenario.body.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < scenario.body.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        {scenario.linkText && (
          <div className="mt-3 flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className={`text-xs font-mono break-all ${showClues && scenario.isPhishing ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded' : 'text-primary'}`}>
              {scenario.linkText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SMS Card UI ─────────────────────────────────────────────────────

function SmsCard({ scenario, showClues }: { scenario: Scenario; showClues: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm max-w-sm mx-auto">
      {/* SMS Header */}
      <div className="border-b border-border/60 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className={`text-sm font-semibold leading-tight ${showClues && scenario.isPhishing ? 'text-red-600 dark:text-red-400' : ''}`}>
              {scenario.sender}
            </p>
            <p className={`text-[10px] font-mono ${showClues && scenario.isPhishing ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1 rounded' : 'text-muted-foreground'}`}>
              {scenario.senderAddress}
            </p>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">Hoje, 14:32</span>
      </div>
      {/* SMS Body */}
      <div className="p-4">
        <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-3.5">
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {scenario.body}
          </p>
          {scenario.linkText && (
            <div className="mt-2 flex items-center gap-1.5">
              <ExternalLink className="h-3 w-3 text-primary shrink-0" />
              <span className={`text-xs font-mono break-all ${showClues && scenario.isPhishing ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded' : 'text-primary'}`}>
                {scenario.linkText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WhatsApp Card UI ────────────────────────────────────────────────

function WhatsAppCard({ scenario, showClues }: { scenario: Scenario; showClues: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm max-w-sm mx-auto">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] dark:bg-[#054640] px-4 py-2.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-white leading-tight ${showClues && scenario.isPhishing ? 'line-through decoration-red-400' : ''}`}>
            {scenario.sender}
          </p>
          <p className={`text-[10px] text-white/70 font-mono ${showClues && scenario.isPhishing ? 'text-red-300' : ''}`}>
            {scenario.senderAddress}
          </p>
        </div>
        <span className="text-[10px] text-white/70">Hoje, 14:32</span>
      </div>
      {/* WhatsApp Body */}
      <div className="bg-[#ECE5DD] dark:bg-[#1a2721] p-4 min-h-[120px] relative">
        {/* WhatsApp wallpaper pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        <div className="relative">
          {/* Green bubble */}
          <div className="bg-[#DCF8C6] dark:bg-[#1f3a2e] rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[90%]">
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {scenario.body}
            </p>
            {scenario.linkText && (
              <div className="mt-2 flex items-center gap-1.5">
                <ExternalLink className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className={`text-xs font-mono break-all ${showClues && scenario.isPhishing ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded' : 'text-blue-600 dark:text-blue-400'}`}>
                  {scenario.linkText}
                </span>
              </div>
            )}
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-muted-foreground">14:32</span>
              <span className="text-[10px] text-[#075E54] dark:text-[#4FC3F7]">✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario Renderer ───────────────────────────────────────────────

function ScenarioCard({ scenario, showClues }: { scenario: Scenario; showClues: boolean }) {
  switch (scenario.type) {
    case 'email':
      return <EmailCard scenario={scenario} showClues={showClues} />;
    case 'sms':
      return <SmsCard scenario={scenario} showClues={showClues} />;
    case 'whatsapp':
      return <WhatsAppCard scenario={scenario} showClues={showClues} />;
    default:
      return null;
  }
}

// ─── Type Icon ───────────────────────────────────────────────────────

function TypeIcon({ type }: { type: ScenarioType }) {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'sms':
      return <Phone className="h-4 w-4" />;
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return null;
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export function PhishingSimulator() {
  const { addPoints, addBadge } = useAppStore();
  const [phase, setPhase] = useState<GamePhase>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [shuffledScenarios, setShuffledScenarios] = useState<Scenario[]>([]);
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize shuffled scenarios on mount
  useEffect(() => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    setShuffledScenarios(shuffled);
  }, []);

  const currentScenario = shuffledScenarios[currentIndex];

  const startGame = useCallback(() => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    setShuffledScenarios(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setSelectedVerdict(null);
    setPhase('playing');
    setShowConfetti(false);
  }, []);

  const handleVerdict = useCallback((verdict: Verdict) => {
    if (!currentScenario) return;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const correct = verdict === currentScenario.verdict;

    setSelectedVerdict(verdict);

    if (correct) {
      setScore(s => s + 10);
      addPoints(10);
    }

    setAnswers(prev => [...prev, {
      scenarioId: currentScenario.id,
      userVerdict: verdict,
      correct,
      timeTaken,
    }]);
    setPhase('feedback');
  }, [currentScenario, questionStartTime, addPoints]);

  const nextScenario = useCallback(() => {
    if (currentIndex + 1 >= shuffledScenarios.length) {
      // Game complete
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      const correctCount = answers.filter(a => a.correct).length + (selectedVerdict === currentScenario?.verdict ? 0 : 0);
      const finalCorrect = answers.filter(a => a.correct).length;
      const percentage = finalCorrect / shuffledScenarios.length;

      if (percentage >= 0.8) {
        addBadge('🎣 Detetive de Phishing');
        setShowConfetti(true);
      }
      // Add bonus points for completion
      addPoints(20);
      setPhase('results');
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedVerdict(null);
      setQuestionStartTime(Date.now());
      setPhase('playing');
    }
  }, [currentIndex, shuffledScenarios.length, startTime, answers, selectedVerdict, currentScenario, addBadge, addPoints]);

  const resetGame = useCallback(() => {
    setPhase('start');
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedVerdict(null);
    setShowConfetti(false);
  }, []);

  // ─── Render: Start Screen ───────────────────────────────────────

  if (phase === 'start') {
    return (
      <div className="space-y-6">
        <div className="section-header">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Fish className="h-6 w-6 text-primary" />
            Treino Anti-Phishing
          </h2>
          <p className="text-muted-foreground mt-1">
            Aprenda a identificar mensagens fraudulentas no contexto angolano
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glow-hover card-shine border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-6 sm:p-8 text-center space-y-6">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ShieldAlert className="h-10 w-10 text-primary" />
              </motion.div>

              <div>
                <h3 className="text-xl font-bold mb-2">Desafio de Detecção de Phishing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Serão apresentadas 10 mensagens (emails, SMS e WhatsApp) no contexto angolano.
                  Identifique quais são <strong className="text-red-500">phishing</strong> e quais são <strong className="text-emerald-500">legítimas</strong>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-lg font-bold text-primary">10</p>
                  <p className="text-[10px] text-muted-foreground">Cenários</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-lg font-bold text-amber-500">+10</p>
                  <p className="text-[10px] text-muted-foreground">Por acerto</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-lg font-bold">🎣</p>
                  <p className="text-[10px] text-muted-foreground">Badge</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> O que observar:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 pl-1">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    Endereço do remetente (domínio oficial vs. falso)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    Urgência e pressão para agir rapidamente
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    Links suspeitos (verifique o domínio real)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    Pedidos de dados pessoais ou documentos
                  </li>
                </ul>
              </div>

              <Button onClick={startGame} size="lg" className="gap-2 px-8">
                <Zap className="h-4 w-4" />
                Iniciar Desafio
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── Render: Playing / Feedback ─────────────────────────────────

  if (phase === 'playing' || phase === 'feedback') {
    const progressValue = ((currentIndex + (phase === 'feedback' ? 1 : 0)) / shuffledScenarios.length) * 100;
    const isCorrect = selectedVerdict === currentScenario?.verdict;

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={resetGame} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Sair
          </Button>
          <div className="flex-1">
            <Progress value={progressValue} className="h-2 progress-gradient" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs gap-1">
              <Star className="h-3 w-3 text-amber-500" />
              {score} pts
            </Badge>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentIndex + 1}/{shuffledScenarios.length}
            </span>
          </div>
        </div>

        {/* Scenario type indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-xs">
            <TypeIcon type={currentScenario.type} />
            {currentScenario.type === 'email' ? 'Email' : currentScenario.type === 'sms' ? 'SMS' : 'WhatsApp'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {phase === 'playing' ? 'Esta mensagem é legítima ou phishing?' : isCorrect ? 'Correcto!' : 'Incorrecto!'}
          </span>
        </div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id + (phase === 'feedback' ? '-fb' : '')}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className={phase === 'feedback'
              ? isCorrect
                ? 'ring-2 ring-emerald-500/50 rounded-xl'
                : 'ring-2 ring-red-500/50 rounded-xl'
              : ''
            }
          >
            <ScenarioCard scenario={currentScenario} showClues={phase === 'feedback'} />
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        {phase === 'playing' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 justify-center pt-2"
          >
            <Button
              size="lg"
              onClick={() => handleVerdict('legitimo')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              <ShieldCheck className="h-5 w-5" />
              ✅ Legítimo
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => handleVerdict('phishing')}
              className="gap-2 px-8"
            >
              <ShieldAlert className="h-5 w-5" />
              🔴 Phishing
            </Button>
          </motion.div>
        ) : (
          /* Feedback */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Result badge */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Badge className={`text-sm px-4 py-1.5 gap-1.5 ${isCorrect
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        +10 pontos
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        +0 pontos
                      </>
                    )}
                  </Badge>
                </motion.div>
              </div>

              {/* Explanation */}
              <Card className={`border-2 ${isCorrect ? 'border-emerald-200 dark:border-emerald-800/50' : 'border-red-200 dark:border-red-800/50'}`}>
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Explicação
                    </p>
                    <p className="text-sm leading-relaxed">{currentScenario.explanation}</p>
                  </div>

                  {/* Clue highlights */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Indicadores:</p>
                    <div className="space-y-1.5">
                      {currentScenario.clues.map((clue, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                            clue.isRedFlag
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {clue.isRedFlag
                            ? <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            : <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          }
                          {clue.text}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next button */}
              <div className="flex justify-end">
                <Button onClick={nextScenario} className="gap-2">
                  {currentIndex + 1 >= shuffledScenarios.length ? 'Ver Resultado' : 'Próximo Cenário'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  // ─── Render: Results ────────────────────────────────────────────

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const correctCount = answers.filter(a => a.correct).length;
  const percentage = Math.round((correctCount / shuffledScenarios.length) * 100);
  const avgTime = answers.length > 0
    ? Math.round(answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length)
    : 0;

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  const gradeLabel = percentage >= 90 ? 'Lenda' : percentage >= 80 ? 'Excelente' : percentage >= 60 ? 'Bom' : percentage >= 40 ? 'Razoável' : 'Necessita Melhorar';
  const gradeColor = percentage >= 80 ? 'text-emerald-500' : percentage >= 60 ? 'text-amber-500' : 'text-red-500';

  const confettiColors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Fish className="h-6 w-6 text-primary" />
          Treino Anti-Phishing
        </h2>
        <p className="text-muted-foreground mt-1">
          Resultado do desafio
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto space-y-6"
      >
        {/* Confetti for high scores */}
        {showConfetti && (
          <div className="relative h-0 overflow-visible">
            {confettiColors.map((color, i) => (
              <ConfettiParticle key={i} delay={i * 0.15} color={color} />
            ))}
          </div>
        )}

        <Card className="glow-hover card-shine border-primary/20 text-center">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center mx-auto"
            >
              {percentage >= 80 ? (
                <Trophy className="h-12 w-12 text-amber-500" />
              ) : percentage >= 60 ? (
                <Award className="h-12 w-12 text-primary" />
              ) : (
                <ShieldAlert className="h-12 w-12 text-muted-foreground" />
              )}
            </motion.div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold mb-1">Desafio Completo!</h2>
              <p className={`text-lg font-semibold ${gradeColor}`}>{gradeLabel}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                <p className="text-3xl font-bold text-primary">{correctCount}/{shuffledScenarios.length}</p>
                <p className="text-[10px] text-muted-foreground">Acertos</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                <p className="text-3xl font-bold text-amber-500">{percentage}%</p>
                <p className="text-[10px] text-muted-foreground">Precisão</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                <p className="text-3xl font-bold">
                  {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" /> Tempo
                </p>
              </div>
            </div>

            {/* Badge earned */}
            <div className="flex items-center justify-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${percentage >= 80
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30'
                : 'bg-muted opacity-50'
              }`}>
                🎣
              </div>
              <div className="text-left">
                <p className={`text-sm font-semibold ${percentage >= 80 ? '' : 'text-muted-foreground'}`}>
                  Detetive de Phishing
                </p>
                <p className="text-xs text-muted-foreground">
                  {percentage >= 80
                    ? 'Badge desbloqueada! ✨'
                    : `Necessita ${80 - percentage}% mais para desbloquear`
                  }
                </p>
              </div>
            </div>

            {/* Points earned */}
            <div className="flex items-center justify-center gap-2 bg-primary/5 rounded-xl p-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                +{score} pontos ganhos neste desafio
              </span>
            </div>

            {/* Scenario Breakdown */}
            <div className="text-left">
              <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Detalhes por cenário
              </p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {answers.map((answer, i) => {
                  const scenario = shuffledScenarios[i];
                  return (
                    <motion.div
                      key={answer.scenarioId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg text-xs ${
                        answer.correct
                          ? 'bg-emerald-50 dark:bg-emerald-900/20'
                          : 'bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      {answer.correct
                        ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">
                          {scenario.preview}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          {scenario.isPhishing ? 'Era phishing' : 'Era legítimo'} •
                          Resposta: {answer.userVerdict === 'phishing' ? '🔴 Phishing' : '✅ Legítimo'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                        <TypeIcon type={scenario.type} />
                        {scenario.type === 'email' ? 'Email' : scenario.type.toUpperCase()}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={resetGame} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Repetir
              </Button>
              <Button onClick={resetGame} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}