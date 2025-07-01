// Local storage caching utilities

export async function fetchWithCache<T = any>(url: string, expiry = 24 * 60 * 60 * 1000): Promise<T> {
  const cachedData = localStorage.getItem(url);
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < expiry) {
        return data;
      }
    } catch {}
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  try {
    localStorage.setItem(url, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Cache quota exceeded, skipping cache for', url);
  }
  return data;
}

export function clearCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("https://pokeapi.co/")) {
      localStorage.removeItem(key);
    }
  });
}

export function removeCacheEntry(url: string) {
  localStorage.removeItem(url);
} 