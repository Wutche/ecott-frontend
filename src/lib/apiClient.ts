'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { ApiError } from '@/lib/apiError';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Client-side fetch against the live API for use in client components
// (mutations, interactive pages). Pulls the bearer token from the browser
// Supabase session and normalizes errors the same way the server helper does.
export async function apiFetchClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
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

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
