// Local storage caching utilities
import LZString from 'lz-string';

const CACHE_KEYS_KEY = 'pokeapi_cache_keys';
const CACHE_LIMIT = 700;

function getCacheKeys(): string[] {
  try {
    const keys = localStorage.getItem(CACHE_KEYS_KEY);
    return keys ? JSON.parse(keys) : [];
  } catch {
    return [];
  }
}

function setCacheKeys(keys: string[]) {
  try {
    localStorage.setItem(CACHE_KEYS_KEY, JSON.stringify(keys));
  } catch { }
}

function updateLRU(key: string) {
  let keys = getCacheKeys();
  // Remove if already present
  keys = keys.filter(k => k !== key);
  // Add to front (most recently used)
  keys.unshift(key);
  // Remove oldest if over limit
  while (keys.length > CACHE_LIMIT) {
    const oldKey = keys.pop();
    if (oldKey) localStorage.removeItem(oldKey);
  }
  setCacheKeys(keys);
}

export async function fetchWithCache<T = any>(url: string, expiry = 24 * 60 * 60 * 1000): Promise<T> {
  const cachedData = localStorage.getItem(url);
  if (cachedData) {
    try {
      const decompressed = LZString.decompressFromUTF16(cachedData);
      const { data, timestamp } = JSON.parse(decompressed!);
      if (Date.now() - timestamp < expiry) {
        updateLRU(url);
        return data;
      }
    } catch { }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  try {
    const compressed = LZString.compressToUTF16(JSON.stringify({ data, timestamp: Date.now() }));
    localStorage.setItem(url, compressed);
    updateLRU(url);
  } catch (e) {
    console.warn('Cache quota exceeded, skipping cache for', url);
  }
  return data;
}

export function clearCache() {
  const keys = getCacheKeys();
  keys.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(CACHE_KEYS_KEY);
}

export function removeCacheEntry(url: string) {
  localStorage.removeItem(url);
  let keys = getCacheKeys();
  keys = keys.filter(k => k !== url);
  setCacheKeys(keys);
} 