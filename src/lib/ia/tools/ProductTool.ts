import { tool } from 'ai';
import { z } from 'zod';

export const ProductAddTool = (organizationId: string) => tool({
  description: 'Adiciona um novo produto ao catálogo.',
  parameters: z.object({
    name: z.string().describe('Nome do produto.'),
    price: z.number().describe('Preço do produto.'),
    description: z.string().optional().describe('Descrição do produto.')
  }),
  execute: async ({ name, price, description }) => {
    console.log('ProductAddTool executado para organizacao:', organizationId, { name, price, description });
    return {
      success: true,
      message: `Produto '${name}' adicionado com sucesso à organização ${organizationId} (mock/simulado).`,
      productId: 'mock-product-id'
    };
  }
});

export const ProductSearchTool = (organizationId: string) => tool({
  description: 'Pesquisa produtos no catálogo.',
  parameters: z.object({
    query: z.string().describe('Termo de pesquisa para encontrar produtos.')
  }),
  execute: async ({ query }) => {
    console.log('ProductSearchTool executado para organizacao:', organizationId, { query });
    return {
      success: true,
      products: [
        { id: 'mock-p1', name: `Produto Exemplo de ${query}`, price: 99.99 }
      ]
    };
  }
});

export const PurchaseAddTool = (organizationId: string, userId: string) => tool({
  description: 'Adiciona uma nova compra de um produto para um utilizador.',
  parameters: z.object({
    productId: z.string().describe('ID do produto comprado.'),
    quantity: z.number().default(1).describe('Quantidade comprada.')
  }),
  execute: async ({ productId, quantity }) => {
    console.log('PurchaseAddTool executado para organizacao:', organizationId, 'usuario:', userId, { productId, quantity });
    return {
      success: true,
      message: `Compra de ${quantity} unidade(s) do produto '${productId}' registrada com sucesso para o utilizador ${userId} (mock/simulado).`,
      purchaseId: 'mock-purchase-id'
    };
  }
});
