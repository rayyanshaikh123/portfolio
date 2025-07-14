import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import ContactMessage from '../../../models/ContactMessage';

export async function GET() {
  await dbConnect();
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const message = await ContactMessage.create({
    name: data.name,
    email: data.email,
    message: data.message,
  });
  return NextResponse.json(message, { status: 201 });
} 