interface JwtPayload {
  exp: number;
  iat: number;
  id: string;
  role: string;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (_) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

export function getTokenTimeLeft(token: string): number {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return 0;

  const currentTime = Date.now() / 1000;
  return decoded.exp - currentTime; // Retorna segundos restantes
}
