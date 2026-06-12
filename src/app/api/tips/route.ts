import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tips = await db.tip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Shuffle for variety
    const shuffled = tips.sort(() => Math.random() - 0.5);

    return NextResponse.json({ success: true, tips: shuffled });
  } catch (error) {
    console.error('Tips API error:', error);
    return NextResponse.json({ error: 'Erro ao carregar dicas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    await db.tip.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tip like error:', error);
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}