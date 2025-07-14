import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
// @ts-ignore
import Project from '../../../models/Project';

export async function GET() {
  await dbConnect();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const project = await Project.create(data);
  return NextResponse.json(project, { status: 201 });
} 