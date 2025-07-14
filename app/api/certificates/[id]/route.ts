import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Certificate from '../../../../models/Certificate';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }
    return NextResponse.json(certificate);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await Certificate.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const deleted = await Certificate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
} 