import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Certificate from '../../../models/Certificate';

export async function GET() {
  await dbConnect();
  const certificates = await Certificate.find().sort({ createdAt: -1 });
  return NextResponse.json(certificates);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const certificate = await Certificate.create(data);
  return NextResponse.json(certificate, { status: 201 });
} 