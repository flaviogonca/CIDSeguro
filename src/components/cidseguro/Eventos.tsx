'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, MapPin, Users, Video, Trophy,
  GraduationCap, Mic, Shield, ChevronRight, ExternalLink,
  Gift, Star, Zap, MonitorSmartphone
} from 'lucide-react';

const eventos = [
  {
    id: 1,
    titulo: 'Hackathon Nacional de Cibersegurança 2024',
    data: '15-17 Agosto 2024',
    local: 'Centro de Convenções de Luanda',
    tipo: 'hackathon',
    inscricoes: 234,
    maxInscricoes: 300,
    descricao: '48 horas de inovação para criar soluções de cibersegurança para Angola. Prémios totais de 5.000.000 Kz.',
    destaque: true,
    pontos: 50,
    icono: <Trophy className="h-5 w-5" />,
    cor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    borda: 'border-amber-200 dark:border-amber-800/50'
  },
  {
    id: 2,
    titulo: 'Workshop: Protecção contra Phishing para PMEs',
    data: '22 Agosto 2024',
    local: 'Online (Zoom)',
    tipo: 'workshop',
    inscricoes: 89,
    maxInscricoes: 150,
    descricao: 'Workshop prático de 3 horas para pequenas e médias empresas. Aprenda a identificar e prevenir ataques de phishing.',
    destaque: false,
    pontos: 25,
    icono: <GraduationCap className="h-5 w-5" />,
    cor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    borda: 'border-emerald-200 dark:border-emerald-800/50'
  },
  {
    id: 3,
    titulo: 'Mentoria em Carreira de Cibersegurança',
    data: '5 Setembro 2024',
    local: 'Universidade Agostinho Neto',
    tipo: 'mentoria',
    inscricoes: 45,
    maxInscricoes: 60,
    descricao: 'Sessão de mentoria com profissionais de cibersegurança. Ideal para estudantes e jovens profissionais.',
    destaque: false,
    pontos: 30,
    icono: <Mic className="h-5 w-5" />,
    cor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    borda: 'border-violet-200 dark:border-violet-800/50'
  },
  {
    id: 4,
    titulo: 'Webinar: Segurança no Multicaixa Express',
    data: '12 Setembro 2024',
    local: 'Online (YouTube Live)',
    tipo: 'webinar',
    inscricoes: 312,
    maxInscricoes: 500,
    descricao: 'Webinar gratuito sobre como proteger a sua conta Multicaixa Express. Com especialistas do banco e da CIDSeguro.',
    destaque: true,
    pontos: 15,
    icono: <Shield className="h-5 w-5" />,
    cor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    borda: 'border-sky-200 dark:border-sky-800/50'
  },
  {
    id: 5,
    titulo: 'Desafio Semanal: Identifique o Phishing',
    data: 'Toda sexta-feira',
    local: 'Plataforma CIDSeguro (online)',
    tipo: 'desafio',
    inscricoes: 1567,
    maxInscricoes: null,
    descricao: 'Desafio semanal onde publicamos mensagens reais de phishing e os participantes tentam identificá-las. Classificação em tempo real.',
    destaque: false,
    pontos: 20,
    icono: <Zap className="h-5 w-5" />,
    cor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    borda: 'border-red-200 dark:border-red-800/50'
  },
  {
    id: 6,
    titulo: 'Conferência Nacional de Cibersegurança',
    data: '20-22 Outubro 2024',
    local: 'Hotel Baía, Luanda',
    tipo: 'conferencia',
    inscricoes: 478,
    maxInscricoes: 600,
    descricao: 'A maior conferência de cibersegurança de Angola. 3 dias com keynotes internacionais, workshops e networking.',
    destaque: true,
    pontos: 40,
    icono: <Video className="h-5 w-5" />,
    cor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    borda: 'border-teal-200 dark:border-teal-800/50'
  },
];

const tipoLabels: Record<string, string> = {
  hackathon: '🏆 Hackathon',
  workshop: '🔧 Workshop',
  mentoria: '🤝 Mentoria',
  webinar: '📺 Webinar',
  desafio: '⚡ Desafio',
  conferencia: '🎤 Conferência',
};

export function Eventos() {
  const { addPoints, addBadge } = useAppStore();

  const inscrever = (evt: typeof eventos[0]) => {
    addPoints(5);
    addBadge(`🗓️ ${evt.tipo.charAt(0).toUpperCase() + evt.tipo.slice(1)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          Mentorias & Eventos
        </h2>
        <p className="text-muted-foreground mt-1">
          Formações, workshops e eventos para fortalecer a cibersegurança em Angola
        </p>
      </div>

      {/* Featured Event Banner */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`overflow-hidden border-2 ${eventos[0].borda}`}>
          <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${eventos[0].cor} flex items-center justify-center shrink-0`}>
                {eventos[0].icono}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                    ⭐ Evento em Destaque
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{tipoLabels[eventos[0].tipo]}</Badge>
                </div>
                <h3 className="font-bold text-lg mb-1">{eventos[0].titulo}</h3>
                <p className="text-sm text-muted-foreground mb-3">{eventos[0].descricao}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{eventos[0].data}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{eventos[0].local}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{eventos[0].inscricoes}/{eventos[0].maxInscricoes} inscritos</span>
                  <span className="flex items-center gap-1"><Gift className="h-3 w-3 text-primary" />+{eventos[0].pontos} pts</span>
                </div>
              </div>
              <Button className="shrink-0 gap-2" onClick={() => inscrever(eventos[0])}>
                Inscrever-se <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Grid */}
      <div>
        <h3 className="font-semibold mb-3">Próximos Eventos</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {eventos.slice(1).map((evt, i) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className={`h-full border ${evt.destaque ? evt.borda : 'border-border/50'} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-10 h-10 rounded-xl ${evt.cor} flex items-center justify-center`}>
                      {evt.icono}
                    </div>
                    <Badge variant="outline" className="text-[10px]">{tipoLabels[evt.tipo]}</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors leading-snug">{evt.titulo}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">{evt.descricao}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <CalendarDays className="h-3 w-3" />
                    <span>{evt.data}</span>
                    <span className="text-border">•</span>
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{evt.local}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {evt.inscricoes}{evt.maxInscricoes ? `/${evt.maxInscricoes}` : '+'} inscritos
                      </span>
                    </div>
                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                      <Star className="h-3 w-3" />+{evt.pontos} pts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Mentors */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-primary" />
            Mentores Disponíveis
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { nome: 'Dr. António dos Santos', especialidade: 'Segurança Bancária', org: 'Banco Nacional', badge: '🔒' },
              { nome: 'Eng. Teresa Luís', especialidade: 'Forense Digital', org: 'INACOM', badge: '🔍' },
              { nome: 'Prof. Carlos Neto', especialidade: 'Segurança de Redes', org: 'UNITEL', badge: '📡' },
              { nome: 'Dra. Fernanda Maia', especialidade: 'Lei e Privacidade', org: 'Ministério da Justiça', badge: '⚖️' },
            ].map((m, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-card border border-border/50">
                <p className="text-xl mb-1">{m.badge}</p>
                <p className="text-xs font-semibold leading-tight">{m.nome}</p>
                <p className="text-[10px] text-muted-foreground">{m.especialidade}</p>
                <p className="text-[10px] text-muted-foreground/70">{m.org}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}