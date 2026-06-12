import { tool } from 'ai';
import { z } from 'zod';

export const QrcodeGenerateTool = tool({
  description: 'Gera um código QR a partir de um texto ou URL.',
  parameters: z.object({
    text: z.string().describe('O texto ou URL que será codificado no QR Code.')
  }),
  execute: async ({ text }) => {
    console.log('QrcodeGenerateTool executado com:', { text });
    return {
      success: true,
      message: 'Código QR gerado com sucesso (mock/simulado).',
      qrcodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`
    };
  }
});
