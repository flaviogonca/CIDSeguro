'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app';
import { motion } from 'framer-motion';
import {
  Radio, Play, Pause, Volume2, Clock, MapPin,
  Users, Mic, Signal, Share2
} from 'lucide-react';

const programas = [
  {
    id: 1,
    titulo: 'Seguranca Digital para Todos',
    emissora: 'Rádio Luanda',
    horario: 'Terça e Quinta, 14h00',
    apresentador: 'Maria Fernanda Jorge',
    descricao: 'Programa semanal sobre como proteger-se no mundo digital. Dicas práticas, alertas de segurança e entrevistas com especialistas.',
    tipo: 'Semanal',
    cor: 'from-emerald-500 to-emerald-600',
    icono: '🎙️',
    ouvintes: '12,400',
    ativo: true,
    episodios: 48
  },
  {
    id: 2,
    titulo: 'Cibersegurança nas Comunidades',
    emissora: 'Rádio Ngola Yetu',
    horario: 'Sábados, 10h00',
    apresentador: 'João Pedro Silva',
    descricao: 'Programa focado em levar a cibersegurança às comunidades rurais e periurbanas de Angola. Linguagem simples e acessível.',
    tipo: 'Semanal',
    cor: 'from-amber-500 to-orange-500',
    icono: '📡',
    ouvintes: '8,750',
    ativo: true,
    episodios: 32
  },
  {
    id: 3,
    titulo: 'Minuto da Segurança',
    emissora: 'Rádio Nacional de Angola',
    horario: 'Diário, 07h30 e 18h00',
    apresentador: 'Equipa CIDSeguro',
    descricao: 'Micro-programa de 1 minuto com a dica de segurança do dia. Transmitido duas vezes ao dia nos horários de pico.',
    tipo: 'Diário',
    cor: 'from-red-500 to-red-600',
    icono: '⏱️',
    ouvintes: '45,200',
    ativo: true,
    episodios: 156
  },
  {
    id: 4,
    titulo: 'Jovens Seguros na Net',
    emissora: 'Rádio Ecclesia',
    horario: 'Domingos, 16h00',
    apresentador: 'Ana Cristina Dias',
    descricao: 'Especial para jovens sobre segurança online, redes sociais e jogos. Inclui secção de perguntas dos ouvintes.',
    tipo: 'Semanal',
    cor: 'from-violet-500 to-purple-600',
    icono: '🎧',
    ouvintes: '6,300',
    ativo: true,
    episodios: 24
  },
  {
    id: 5,
    titulo: 'Alerta Digital',
    emissora: 'Rádio Mais (Provincias)',
    horario: 'Sextas, 12h00',
    apresentador: 'Rede de Correspondentes',
    descricao: 'Programa transmitido em cadeia para 8 províncias. Alertas em tempo real sobre ameaças digitais locais.',
    tipo: 'Semanal',
    cor: 'from-sky-500 to-blue-600',
    icono: '🚨',
    ouvintes: '22,100',
    ativo: false,
    episodios: 40
  }
];

const alertasRadio = [
  { texto: 'Golpe via SMS falso da Unitel detectado em Luanda', tempo: 'Há 2h', severidade: 'alto' },
  { texto: 'Nova variante de phishing bancário em Benguela', tempo: 'Há 5h', severidade: 'alto' },
  { texto: 'App falsa de Multicaixa circulando no Huambo', tempo: 'Há 1 dia', severidade: 'medio' },
];

export function RadioComunitaria() {
  const { addPoints, addBadge } = useAppStore();
  const [playingId, setPlayingId] = useState<number | null>(null);

  const togglePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      addPoints(3);
      addBadge('📻 Ouvinte Rádio');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Radio className="h-6 w-6 text-primary" />
          Rádio Comunitária
        </h2>
        <p className="text-muted-foreground mt-1">
          Programas de rádio para levar a cibersegurança a todas as comunidades angolanas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Programas Activos', value: '5', icon: <Radio className="h-4 w-4" /> },
          { label: 'Ouvintes Semanais', value: '94.8k', icon: <Users className="h-4 w-4" /> },
          { label: 'Provincias Cobertas', value: '12', icon: <MapPin className="h-4 w-4" /> },
        ].map((s, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-3 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">{s.icon}</div>
              <div>
                <p className="text-lg font-bold leading-none">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card className="border-destructive/30 bg-gradient-to-r from-destructive/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Signal className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold text-sm">Alertas Recentes via Rádio</h3>
          </div>
          <div className="space-y-2">
            {alertasRadio.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2"
              >
                <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${a.severidade === 'alto' ? 'bg-destructive' : 'bg-warning'}`} />
                <div className="flex-1">
                  <p className="text-xs">{a.texto}</p>
                  <p className="text-[10px] text-muted-foreground">{a.tempo}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Programs */}
      <div>
        <h3 className="font-semibold mb-3">Programas no Ar</h3>
        <div className="space-y-4">
          {programas.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
                <div className={`h-1.5 bg-gradient-to-r ${prog.cor}`} />
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.cor} flex items-center justify-center text-2xl shadow-lg`}>
                        {prog.icono}
                      </div>
                      {prog.ativo && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{prog.titulo}</h3>
                        <Badge variant={prog.ativo ? 'secondary' : 'outline'} className="text-[10px] shrink-0">
                          {prog.ativo ? 'Activo' : 'Pausado'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{prog.descricao}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mic className="h-3 w-3" />{prog.apresentador}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{prog.horario}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{prog.ouvintes}</span>
                        <span className="flex items-center gap-1"><Radio className="h-3 w-3" />{prog.episodios} eps</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0 sm:self-center">
                      <Button
                        variant={playingId === prog.id ? 'default' : 'outline'}
                        size="icon"
                        className={`w-12 h-12 rounded-full ${playingId === prog.id ? 'animate-pulse' : ''}`}
                        onClick={() => togglePlay(prog.id)}
                        disabled={!prog.ativo}
                      >
                        {playingId === prog.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                      </Button>
                      <span className="text-[10px] text-muted-foreground">{prog.tipo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Cobertura em Angola
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {['Luanda', 'Benguela', 'Huambo', 'Lubango', 'Cabinda', 'Malanje', 'Namibe', 'Huila', 'Bié', 'Moxico', 'Cuanza Sul', 'Zaire'].map((prov) => (
              <div key={prov} className="text-center p-2 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors">
                <p className="text-[10px] font-medium">{prov}</p>
                <p className="text-[9px] text-muted-foreground">Coberto</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            📡 12 estações de rádio em 12 províncias • Cobertura estimada: 4.2 milhões de angolanos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}