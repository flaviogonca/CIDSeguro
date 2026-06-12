import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

let zaiInstance: any = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    // Basic URL validation
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
    }

    const zai = await getZAI();

    const analysisPrompt = `Analisa esta URL como especialista em cibersegurança no contexto angolano: ${normalizedUrl}

Avalia os seguintes indicadores de risco:
1. Domínio suspeito (typosquatting, domínios enganosos)
2. Uso de HTTPS vs HTTP
3. Subdomínios suspeitos
4. TLDs incomuns ou suspeitos
5. Parâmetros de URL suspeitos
6. Padron de URL que sugere phishing
7. Se parece com sites de bancos, operadoras ou serviços populares em Angola

Responde EM JSON com esta estrutura EXATA:
{
  "riskLevel": "baixo|medio|alto|critico",
  "riskScore": 0-100,
  "indicators": ["indicador 1", "indicador 2"],
  "summary": "Resumo breve da análise",
  "recommendations": ["recomendação 1", "recomendação 2"],
  "isPhishing": true/false,
  "confidence": 0-100
}

Sê rigoroso mas justo. Se o URL parece legítimo, diz isso claramente.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'És um analista de segurança cibernética especializado em detecção de phishing e análise de URLs. Respondes sempre em JSON válido.' },
        { role: 'user', content: analysisPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    let analysisText = completion.choices[0]?.message?.content || '';

    // Try to parse JSON from response
    let analysis;
    try {
      // Extract JSON from the response (may be wrapped in markdown)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = {
          riskLevel: 'medio',
          riskScore: 50,
          indicators: ['Não foi possível analisar automaticamente'],
          summary: analysisText.substring(0, 300),
          recommendations: ['Verifique manualmente o domínio', 'Não insira credenciais'],
          isPhishing: false,
          confidence: 30
        };
      }
    } catch {
      analysis = {
        riskLevel: 'medio',
        riskScore: 50,
        indicators: ['Análise inconclusiva'],
        summary: 'Não foi possível completar a análise automaticamente.',
        recommendations: ['Verifique o URL manualmente', 'Contacte o helpdesk do CIDSeguro'],
        isPhishing: false,
        confidence: 20
      };
    }

    // Save report to database
    await db.securityReport.create({
      data: {
        url: normalizedUrl,
        analysis: JSON.stringify(analysis),
        riskLevel: analysis.riskLevel || 'desconhecido'
      }
    });

    return NextResponse.json({
      success: true,
      url: normalizedUrl,
      analysis
    });

  } catch (error: any) {
    console.error('Scan API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao analisar o link. Tente novamente.'
    }, { status: 500 });
  }
}