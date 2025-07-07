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
    if (oldKey) {
      try {
        localStorage.removeItem(oldKey);
      } catch { }
    }
  }
  setCacheKeys(keys);
}

// Utility to estimate localStorage usage in bytes
function getLocalStorageUsage() {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      total += key.length + (value ? value.length : 0);
    }
  }
  return total;
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

  // Try to cache, evicting if quota is exceeded
  let attempts = 0;
  let success = false;
  while (attempts < 2 && !success) {
    try {
      const compressed = LZString.compressToUTF16(JSON.stringify({ data, timestamp: Date.now() }));
      localStorage.setItem(url, compressed);
      updateLRU(url);
      const usage = getLocalStorageUsage();
      console.info(`localStorage usage: ${(usage / 1024).toFixed(2)} KB`);
      success = true;
    } catch (e: any) {
      if (e && e.name === 'QuotaExceededError') {
        console.warn('Cache quota exceeded, evicting 10% of oldest cache entries and retrying...');
        // Evict 10% of oldest entries
        let keys = getCacheKeys();
        const numToEvict = Math.ceil(keys.length * 0.2) || 1;
        for (let i = keys.length - 1; i >= keys.length - numToEvict; i--) {
          const key = keys[i];
          if (key) {
            try { localStorage.removeItem(key); } catch { }
          }
        }
        keys = keys.slice(0, keys.length - numToEvict);
        setCacheKeys(keys);
      } else {
        console.warn('Cache error, skipping cache for', url);
        break;
      }
    }
    attempts++;
  }
  return data;
}

export function clearCache() {
  const keys = getCacheKeys();
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch { }
  });
  try {
    localStorage.removeItem(CACHE_KEYS_KEY);
  } catch { }
}

export function removeCacheEntry(url: string) {
  try {
    localStorage.removeItem(url);
  } catch { }
  let keys = getCacheKeys();
  keys = keys.filter(k => k !== url);
  setCacheKeys(keys);
} 