import { NextRequest, NextResponse } from 'next/server'
import mongoose, { Schema, model, models } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI)
}

const ContentSchema = new Schema({
  type: String,
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
})

const Content = models.Content || model('Content', ContentSchema)

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization')
  if (auth !== 'Bearer demo-admin-token') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  await dbConnect()
  await Content.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get('authorization')
  if (auth !== 'Bearer demo-admin-token') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  await dbConnect()
  const data = await req.json()
  const updated = await Content.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json({ success: true, item: updated })
} 