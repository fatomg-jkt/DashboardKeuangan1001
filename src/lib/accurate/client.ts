import type { AccurateRequestOptions } from "@/lib/accurate/types";

export class AccurateApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AccurateApiError";
  }
}

export function isMockMode() {
  return process.env.USE_MOCK_DATA === "true" || !process.env.ACCURATE_API_TOKEN;
}

export async function accurateFetch<T>({ path, query }: AccurateRequestOptions): Promise<T> {
  const baseUrl = process.env.ACCURATE_BASE_URL;
  const token = process.env.ACCURATE_API_TOKEN;
  if (!baseUrl || !token) throw new AccurateApiError("Accurate API token/base URL belum dikonfigurasi", 401);

  const url = new URL(path, baseUrl);
  Object.entries(query ?? {}).forEach(([key, value]) => value !== undefined && url.searchParams.set(key, String(value)));
  if (process.env.ACCURATE_DB_ID) url.searchParams.set("databaseId", process.env.ACCURATE_DB_ID);

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "X-Session-ID": process.env.ACCURATE_SESSION_ID ?? ""
  };

  return withRetry(async () => {
    const response = await fetch(url, { headers, cache: "no-store" });
    if (response.status === 401 || response.status === 403) throw new AccurateApiError("Token Accurate invalid atau expired", response.status);
    if (response.status === 429) throw new AccurateApiError("Rate limit Accurate API tercapai", response.status);
    if (!response.ok) throw new AccurateApiError(`Accurate API error: ${response.status}`, response.status);
    return response.json() as Promise<T>;
  });
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await fn(); } catch (error) {
      lastError = error;
      if (error instanceof AccurateApiError && error.status && [401, 403].includes(error.status)) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
  throw lastError;
}
