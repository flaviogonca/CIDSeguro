'use client';

import { Shield, Heart, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg border border-[#00E676]/40 bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/5 grid place-items-center">
              <Shield className="h-3.5 w-3.5 text-[#00E676]" />
            </div>
            <div className="text-xs text-[#666]">
              <span className="text-white/80 font-semibold">CIDSeguro</span>
              <span className="mx-1.5 text-[#333]">·</span>
              <span>© 2024 · Todos os direitos reservados</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#555]">
            <a href="#" className="hover:text-[#00E676] transition-colors inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Contacto
            </a>
            <a href="#" className="hover:text-[#00E676] transition-colors inline-flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <span className="hidden sm:inline-flex items-center gap-1">
              Feito com <Heart className="h-3 w-3 text-[#00E676] fill-current" /> para Angola 🇦🇴
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
