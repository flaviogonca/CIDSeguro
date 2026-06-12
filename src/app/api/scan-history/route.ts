import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const history = await db.scanHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Scan history GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar histórico' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, riskLevel, riskScore, isPhishing } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    if (!riskLevel || typeof riskLevel !== 'string') {
      return NextResponse.json(
        { success: false, error: 'riskLevel é obrigatório' },
        { status: 400 }
      );
    }

    if (typeof riskScore !== 'number') {
      return NextResponse.json(
        { success: false, error: 'riskScore é obrigatório' },
        { status: 400 }
      );
    }

    if (typeof isPhishing !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isPhishing é obrigatório' },
        { status: 400 }
      );
    }

    const entry = await db.scanHistory.create({
      data: {
        url: url.trim(),
        riskLevel,
        riskScore,
        isPhishing,
      },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Scan history POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao salvar no histórico' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await db.scanHistory.deleteMany({});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Scan history DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao limpar histórico' },
      { status: 500 }
    );
  }
}
