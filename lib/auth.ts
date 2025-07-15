import { SignJWT, jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET env variable not set');
const encoder = new TextEncoder();
const secretKey = encoder.encode(secret);

const refreshSecret = process.env.JWT_REFRESH_SECRET || secret;
const refreshKey = new TextEncoder().encode(refreshSecret);

export async function signAdminToken(payload: Record<string, any>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

export async function signRefreshToken(payload: Record<string, any>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshKey);
    return payload;
  } catch (e) {
    return null;
  }
}

export function isAdmin(payload: any) {
  return payload && payload.role === 'admin';
} 