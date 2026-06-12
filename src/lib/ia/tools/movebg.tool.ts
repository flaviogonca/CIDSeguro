import { tool } from 'ai';
import { z } from 'zod';

export const RemoveBackgroundTool = tool({
  description: 'Remove o fundo de uma imagem.',
  parameters: z.object({
    imageUrl: z.string().url().describe('A URL da imagem cujo fundo será removido.')
  }),
  execute: async ({ imageUrl }) => {
    console.log('RemoveBackgroundTool executado com:', { imageUrl });
    return {
      success: true,
      message: 'Fundo da imagem removido com sucesso (mock/simulado).',
      resultImageUrl: imageUrl
    };
  }
});
