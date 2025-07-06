// Core API Service for PokéAPI

import { fetchWithCache } from "./cache";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = "ApiError";
  }
}

export interface FetchOptions extends RequestInit {
  timeout?: number; // in ms
  useCache?: boolean; // New option to control caching
}

export async function fetchFromApi<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, useCache = true, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    let data: T;
    if (useCache) {
      data = await fetchWithCache<T>(url);
    } else {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      if (!response.ok) {
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new ApiError(errorMsg, response.status, response.statusText);
      }
      try {
        data = await response.json();
      } catch (e) {
        throw new ApiError("Invalid JSON response", response.status, response.statusText);
      }
    }
    clearTimeout(id);
    return { data, status: 200, statusText: "OK" }; // Assuming 200 OK for cached data
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 408, "Timeout");
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network error", 500, "Network Error");
  }
} 