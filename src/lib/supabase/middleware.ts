import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = request.nextUrl.clone();
  const path = url.pathname;

  const role = request.cookies.get('stmik_role')?.value;
  const userId = request.cookies.get('stmik_user_id')?.value;

  const isAdminPath = path.startsWith('/admin');
  const isMahasiswaPath = path.startsWith('/mahasiswa');
  const isDosenPath = path.startsWith('/dosen');

  // Direct Instant Server-Side Redirect for '/'
  if (path === '/') {
    if (role === 'admin') url.pathname = '/admin/dashboard';
    else if (role === 'mahasiswa') url.pathname = '/mahasiswa/dashboard';
    else if (role === 'dosen') url.pathname = '/dosen/dashboard';
    else url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Protect Dashboard Routes: Redirect unauthenticated users to /login
  if ((!role || !userId) && (isAdminPath || isMahasiswaPath || isDosenPath)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect Logged-In users away from /login to their role dashboard
  if (role && userId && path === '/login') {
    if (role === 'admin') url.pathname = '/admin/dashboard';
    else if (role === 'mahasiswa') url.pathname = '/mahasiswa/dashboard';
    else if (role === 'dosen') url.pathname = '/dosen/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
