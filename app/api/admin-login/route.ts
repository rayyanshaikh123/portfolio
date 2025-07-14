import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    // For demo, just return a fake token
    return NextResponse.json({ success: true, token: 'demo-admin-token' })
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
} 