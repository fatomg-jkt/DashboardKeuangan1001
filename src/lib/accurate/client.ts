import type { QueryFilters } from "@/lib/accurate/types";

export class AccurateApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "AccurateApiError";
  }
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

export function shouldUseMockData() {
  return process.env.USE_MOCK_DATA === "true" || !process.env.ACCURATE_API_TOKEN;
}

function accurateConfig() {
  const { ACCURATE_BASE_URL, ACCURATE_API_TOKEN, ACCURATE_SESSION_ID, ACCURATE_DB_ID } = process.env;
  if (!ACCURATE_BASE_URL || !ACCURATE_API_TOKEN) {
    throw new AccurateApiError("Accurate credentials are missing. Set ACCURATE_BASE_URL and ACCURATE_API_TOKEN or enable USE_MOCK_DATA=true.", 401);
  }
  return { baseUrl: ACCURATE_BASE_URL.replace(/\/$/, ""), token: ACCURATE_API_TOKEN, sessionId: ACCURATE_SESSION_ID, dbId: ACCURATE_DB_ID };
}

function toSearchParams(filters: QueryFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}

export async function accurateFetch<T>(path: string, filters?: QueryFilters, init?: RequestInit, retries = 2): Promise<T> {
  const config = accurateConfig();
  const params = toSearchParams(filters);
  if (config.sessionId) params.set("session", config.sessionId);
  if (config.dbId) params.set("databaseId", config.dbId);
  const url = `${config.baseUrl}${path}${params.toString() ? `?${params.toString()}` : ""}`;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers
      },
      cache: "no-store"
    });

    if (response.ok) return response.json() as Promise<T>;
    if (!RETRYABLE_STATUS.has(response.status) || attempt === retries) {
      const message = response.status === 401 || response.status === 403
        ? "Token Accurate invalid atau expired. Periksa ACCURATE_API_TOKEN dan ACCURATE_SESSION_ID."
        : response.status === 429
          ? "Rate limit Accurate tercapai. Coba ulang beberapa saat lagi."
          : `Accurate API error: ${response.status}`;
      throw new AccurateApiError(message, response.status);
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }
  throw new AccurateApiError("Accurate API request failed.");
}
