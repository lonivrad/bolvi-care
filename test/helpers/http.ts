import { NextRequest } from 'next/server';

const BASE = 'http://localhost:3000';

/** Build a NextRequest with an optional JSON body. */
export function req(
  path: string,
  init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}
): NextRequest {
  const { method = 'GET', body, headers = {} } = init;
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  return new NextRequest(url, {
    method,
    ...(body !== undefined
      ? { body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } }
      : { headers }),
  });
}

/** Wrap route dynamic params in the `{ params: Promise<…> }` shape handlers expect. */
export function ctx<T extends Record<string, string>>(params: T): { params: Promise<T> } {
  return { params: Promise.resolve(params) };
}

/** Parse a handler's Response as JSON. */
export async function json<T = { success: boolean; data?: unknown; error?: string }>(
  res: Response
): Promise<T> {
  return (await res.json()) as T;
}
