// Server-agnostic error type shared by the server (`api.ts`) and client
// (`apiClient.ts`) fetch helpers. Kept in its own module so client bundles
// don't pull in the server-only Supabase client via `api.ts`.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
