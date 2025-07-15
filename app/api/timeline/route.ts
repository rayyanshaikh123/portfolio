import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Timeline from '../../../models/Timeline';
import { verifyToken, isAdmin } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const timeline = await Timeline.find().sort({ createdAt: -1 });
  return NextResponse.json(timeline);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = auth.slice(7);
  const payload = await verifyToken(token);
  if (!isAdmin(payload)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const data = await req.json();
  const entry = await Timeline.create(data);
  return NextResponse.json(entry, { status: 201 });
} 