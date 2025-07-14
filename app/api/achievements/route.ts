import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Achievement from '../../../models/Achievement';

export async function GET() {
  await dbConnect();
  const achievements = await Achievement.find().sort({ createdAt: -1 });
  return NextResponse.json(achievements);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const achievement = await Achievement.create(data);
  return NextResponse.json(achievement, { status: 201 });
} 