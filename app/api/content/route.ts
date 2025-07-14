import { NextRequest, NextResponse } from 'next/server'
import mongoose, { Schema, model, models } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

// Connect to MongoDB
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

export async function GET() {
  await dbConnect()
  const content = await Content.find().sort({ createdAt: -1 })
  return NextResponse.json({ success: true, content })
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== 'Bearer demo-admin-token') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  await dbConnect()
  const data = await req.json()
  const newItem = await Content.create(data)
  return NextResponse.json({ success: true, item: newItem })
} 