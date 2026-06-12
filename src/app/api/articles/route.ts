import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { published: true };
    if (category && category !== 'todos') {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Increment views (async, don't wait)
    // In production, this would be rate-limited

    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Erro ao carregar artigos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    await db.article.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Article view error:', error);
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}