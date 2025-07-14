import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Timeline from '../../../models/Timeline';

export async function GET() {
  await dbConnect();
  const timeline = await Timeline.find().sort({ createdAt: -1 });
  return NextResponse.json(timeline);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const entry = await Timeline.create(data);
  return NextResponse.json(entry, { status: 201 });
} 