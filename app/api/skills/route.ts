import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Skill from '../../../models/Skill';

export async function GET() {
  await dbConnect();
  const skills = await Skill.find().sort({ createdAt: 1 });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const skill = await Skill.create({ name: data.name });
  return NextResponse.json(skill, { status: 201 });
} 