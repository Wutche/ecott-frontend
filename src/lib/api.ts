import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/apiError';

export { ApiError };

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface ApiFetchOptions extends RequestInit {
  // Override the token (e.g. from a client component); defaults to the
  // current server-side Supabase session.
  token?: string;
}

// Server-side fetch against the live API. Attaches the Supabase bearer token,
// prefixes the base URL, and normalizes errors. Use in server components and
// route handlers. Reads are uncached so each request reflects live data.
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token: overrideToken, headers, ...init } = options;

  let token = overrideToken;
  if (!token) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      typeof detail?.code === 'string' ? detail.code : 'request_failed',
      typeof detail?.message === 'string' ? detail.message : response.statusText,
    );
  }

  return response.json() as Promise<T>;
}

// Variant that returns null on a 404 instead of throwing, for optional
// resources that legitimately may not exist yet (e.g. no risk-sentiment score
// computed, no weekly story for a pair). Other errors still propagate.
export async function apiFetchOrNull<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T | null> {
  try {
    return await apiFetch<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
