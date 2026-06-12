import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const quizzes = await db.quiz.findMany({
      include: { questions: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (error) {
    console.error('Quizzes API error:', error);
    return NextResponse.json({ error: 'Erro ao carregar quizzes' }, { status: 500 });
  }
}