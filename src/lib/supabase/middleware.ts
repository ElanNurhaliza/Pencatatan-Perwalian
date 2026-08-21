import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protected paths
  const isAdminPath = path.startsWith('/admin');
  const isMahasiswaPath = path.startsWith('/mahasiswa');
  const isDosenPath = path.startsWith('/dosen');

  if (!user && (isAdminPath || isMahasiswaPath || isDosenPath)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    // Fetch profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role;

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
