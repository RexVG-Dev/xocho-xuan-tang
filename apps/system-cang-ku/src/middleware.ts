import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si alguien intenta acceder a la ruta raíz "/",
  // siempre lo redirigimos a "/login".
  // La lógica para redirigir a "/dashboard" si ya hay sesión
  // se manejará en el layout del login.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// El 'matcher' define qué rutas serán interceptadas por este middleware.
// Protegemos todas las rutas excepto las de archivos estáticos (_next), etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};