import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Erro ao carregar notificações' }, { status: 500 });
  }
}