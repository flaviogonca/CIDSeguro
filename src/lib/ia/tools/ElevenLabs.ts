import { tool } from 'ai';
import { z } from 'zod';

export const ElevenLabsTool = tool({
  description: 'Gera áudio ou fala a partir de um texto usando a API do ElevenLabs.',
  parameters: z.object({
    text: z.string().describe('O texto que será convertido em fala.'),
    voiceId: z.string().optional().describe('ID da voz opcional a ser usada.')
  }),
  execute: async ({ text, voiceId }) => {
    console.log('ElevenLabsTool executado com:', { text, voiceId });
    return {
      success: true,
      message: 'Áudio gerado com sucesso (mock/simulado).',
      audioUrl: 'https://example.com/mock-audio.mp3'
    };
  }
});
