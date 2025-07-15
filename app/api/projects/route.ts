import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { verifyToken, isAdmin } from '@/lib/auth';
// @ts-ignore
import Project from '../../../models/Project';

export async function GET() {
  await dbConnect();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
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
  const project = await Project.create(data);
  return NextResponse.json(project, { status: 201 });
} 