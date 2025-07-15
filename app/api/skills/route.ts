import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Skill from '../../../models/Skill';
import { verifyToken, isAdmin } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const skills = await Skill.find().sort({ createdAt: 1 });
  return NextResponse.json(skills);
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
  const skill = await Skill.create({ name: data.name });
  return NextResponse.json(skill, { status: 201 });
} 