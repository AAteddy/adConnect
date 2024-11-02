// pages/admin/_middleware.js
import { getSession } from 'next-auth/react';

export async function middleware(req) {
  const session = await getSession({ req });
  if (!session) {
    return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
  }
  return new Response(null, { status: 200 });
}