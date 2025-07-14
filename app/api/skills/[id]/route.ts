import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Skill from '../../../../models/Skill';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();
  try {
    const updated = await Skill.findByIdAndUpdate(id, { name: data.name }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
} 