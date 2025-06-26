// Core API Service for PokéAPI

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
}

export async function fetchFromApi<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    const status = response.status;
    const statusText = response.statusText;
    if (!response.ok) {
      let errorMsg = `API Error: ${status} ${statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {}
      throw new ApiError(errorMsg, status, statusText);
    }
    let data: T;
    try {
      data = await response.json();
    } catch (e) {
      throw new ApiError("Invalid JSON response", status, statusText);
    }
    return { data, status, statusText };
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out", 408, "Timeout");
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network error", 500, "Network Error");
  }
} 