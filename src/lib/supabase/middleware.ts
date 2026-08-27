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

  // If not logged in and accessing protected route -> redirect to /login
  if ((!role || !userId) && (isAdminPath || isMahasiswaPath || isDosenPath)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in and accessing /login or / -> redirect to role dashboard
  if (role && userId) {
    if (path === '/login' || path === '/') {
      if (role === 'admin') url.pathname = '/admin/dashboard';
      else if (role === 'mahasiswa') url.pathname = '/mahasiswa/dashboard';
      else if (role === 'dosen') url.pathname = '/dosen/dashboard';
      return NextResponse.redirect(url);
    }

    if (isAdminPath && role !== 'admin') {
      url.pathname = role === 'mahasiswa' ? '/mahasiswa/dashboard' : '/dosen/dashboard';
      return NextResponse.redirect(url);
    }

    if (isMahasiswaPath && role !== 'mahasiswa') {
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/dosen/dashboard';
      return NextResponse.redirect(url);
    }

    if (isDosenPath && role !== 'dosen') {
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/mahasiswa/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response;
}
