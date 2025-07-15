import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, signRefreshToken, verifyRefreshToken, isAdmin } from '@/lib/auth';
import RefreshToken from '@/models/RefreshToken';
import { dbConnect } from '@/lib/db';
import bcrypt from 'bcryptjs';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

function setRefreshCookie(res: NextResponse, token: string) {
  res.cookies.set(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_OPTIONS);
}

function clearRefreshCookie(res: NextResponse) {
  res.cookies.set(REFRESH_COOKIE_NAME, '', { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const payload = { role: 'admin' };
    const token = await signAdminToken(payload);
    const refreshToken = await signRefreshToken(payload);
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    await RefreshToken.create({ tokenHash, user: 'admin', expiresAt });
    const res = NextResponse.json({ success: true, token });
    setRefreshCookie(res, refreshToken);
    return res;
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return NextResponse.json({ success: false, message: 'No refresh token provided' }, { status: 400 });
  }
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload || !isAdmin(payload)) {
    const res = NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
    clearRefreshCookie(res);
    return res;
  }
  // Check DB for valid token
  const tokens = await RefreshToken.find({ user: 'admin' });
  let found = false;
  let tokenDoc = null;
  for (const t of tokens) {
    if (await bcrypt.compare(refreshToken, t.tokenHash)) {
      found = true;
      tokenDoc = t;
      break;
    }
  }
  if (!found) {
    const res = NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
    clearRefreshCookie(res);
    return res;
  }
  // Rotate: delete old, issue new
  await RefreshToken.deleteOne({ _id: tokenDoc._id });
  const newRefreshToken = await signRefreshToken({ role: 'admin' });
  const newTokenHash = await bcrypt.hash(newRefreshToken, 10);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await RefreshToken.create({ tokenHash: newTokenHash, user: 'admin', expiresAt });
  const token = await signAdminToken({ role: 'admin' });
  const res = NextResponse.json({ success: true, token });
  setRefreshCookie(res, newRefreshToken);
  return res;
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (refreshToken) {
    const tokens = await RefreshToken.find({ user: 'admin' });
    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        await RefreshToken.deleteOne({ _id: t._id });
        break;
      }
    }
  }
  const res = NextResponse.json({ success: true });
  clearRefreshCookie(res);
  return res;
} 