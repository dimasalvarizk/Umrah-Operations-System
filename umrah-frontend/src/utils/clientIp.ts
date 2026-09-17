/**
 * Client Public IP Detector (Browser-Side Fallback)
 * Fetches the client's public IP in real-time with a fast timeout (600ms)
 * and caches it in memory/sessionStorage so it never slows down UX.
 */

let cachedIp: string | null = null;

export async function getClientPublicIp(): Promise<string | null> {
  if (cachedIp) return cachedIp;

  try {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('client_public_ip') : null;
    if (saved && saved !== '127.0.0.1') {
      cachedIp = saved;
      return saved;
    }
  } catch {}

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 800);

  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip && !data.ip.startsWith('127.') && data.ip !== '::1') {
        cachedIp = String(data.ip).trim();
        try {
          sessionStorage.setItem('client_public_ip', cachedIp);
        } catch {}
        return cachedIp;
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  // Backup probe
  try {
    const res2 = await fetch('https://icanhazip.com', {
      signal: AbortSignal.timeout(600),
    });
    if (res2.ok) {
      const ipText = (await res2.text()).trim();
      if (ipText && !ipText.startsWith('127.') && ipText !== '::1') {
        cachedIp = ipText;
        try {
          sessionStorage.setItem('client_public_ip', cachedIp);
        } catch {}
        return cachedIp;
      }
    }
  } catch {}

  return null;
}
