import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Timeline from '../../../../models/Timeline';
import { verifyToken, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const entry = await Timeline.findById(id);
    if (!entry) {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch timeline entry' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await Timeline.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update timeline entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
  const { id } = params;
  try {
    const deleted = await Timeline.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Timeline entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete timeline entry' }, { status: 500 });
  }
} 