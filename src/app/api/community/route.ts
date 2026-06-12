import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const posts = await db.communityPost.findMany({
      include: { comments: { take: 3, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Community API error:', error);
    return NextResponse.json({ error: 'Erro ao carregar posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (action === 'create_post') {
      const { authorName, title, content, category } = data;
      if (!authorName || !title || !content) {
        return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
      }

      const post = await db.communityPost.create({
        data: { authorName, title, content, category: category || 'geral' }
      });

      return NextResponse.json({ success: true, post });
    }

    if (action === 'add_comment') {
      const { postId, authorName, content } = data;
      if (!postId || !authorName || !content) {
        return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
      }

      const comment = await db.communityComment.create({
        data: { postId, authorName, content }
      });

      await db.communityPost.update({
        where: { id: postId },
        data: { replies: { increment: 1 } }
      });

      return NextResponse.json({ success: true, comment });
    }

    if (action === 'like_post') {
      const { id } = data;
      if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

      await db.communityPost.update({
        where: { id },
        data: { likes: { increment: 1 } }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acção inválida' }, { status: 400 });
  } catch (error) {
    console.error('Community POST error:', error);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}