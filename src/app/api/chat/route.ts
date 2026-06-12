import { NextRequest, NextResponse } from 'next/server';
import { getModel } from '@/src/lib/ia/config';
import { createMCPClient } from '@ai-sdk/mcp';
import { ElevenLabsTool } from '@/src/lib/ia/tools/ElevenLabs';
import { RemoveBackgroundTool } from '@/src/lib/ia/tools/movebg.tool';
import { ProductAddTool, ProductSearchTool, PurchaseAddTool } from '@/src/lib/ia/tools/ProductTool';
import { QrcodeGenerateTool } from '@/src/lib/ia/tools/qrcodeGenerate.tool';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `És o CIDSeguro Bot, um assistente virtual especializado em cibersegurança para o contexto angolano.
A tua missão é ajudar os cidadãos angolanos a protegerem-se contra ameaças cibernéticas.

Diretrizes:
- Responde SEMPRE em português de Angola
- Dá conselhos práticos e acessíveis
- Considera o contexto angolano (conectividade limitada, uso de dispositivos móveis, banking apps populares como Unitel Money, Multicaixa Express)
- Explica conceitos técnicos de forma simples
- Recomenda soluções de baixo custo
- Alerta sobre scams e golpes comuns em Angola
- Sé simpático, profissional e encorajador
- Quando não souberes algo, diz honestamente e sugere recursos confiáveis
- Mantém respostas concisas mas informativas
- Inclui dicas preventivas sempre que possível`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: UIMessage[] = body.messages || [];

    let mcpTools = {};
    // MCP client removed to prevent timeouts

    const metadata = (messages.at(-1)?.metadata || body.metadata || {}) as {
      model?: string;
      webSearch?: boolean;
      organizationId?: string;
      userId?: string;
      voice?: boolean;
    };

    const modelName = metadata.model || body.model || 'mistral';
    const organizationId = metadata.organizationId || body.organizationId || 'default-org';
    const userId = metadata.userId || body.userId || 'default-user';

    const stream = streamText({
      model: getModel(modelName),
      messages: await convertToModelMessages(messages),
      system: SYSTEM_PROMPT,
      tools: {
        ...mcpTools,
        productAdd: ProductAddTool(organizationId),
        purchaseAdd: PurchaseAddTool(organizationId, userId),
        productSearch: ProductSearchTool(organizationId),
        qrcodeGenerate: QrcodeGenerateTool,
        RemoveBackground: RemoveBackgroundTool,
        ElevenLabs: ElevenLabsTool,
      },
      toolChoice: "auto",
    });

    return stream.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });

  } catch (error: any) {
    console.error("Erro no endpoint de chat:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        ...(process.env.NODE_ENV === "development" && { details: error.message }),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Mantemos o método DELETE para compatibilidade de limpar histórico de conversas
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default';
    return NextResponse.json({ success: true, message: 'Conversa limpa (simulado)' });
  } catch {
    return NextResponse.json({ error: 'Erro ao limpar conversa' }, { status: 500 });
  }
}