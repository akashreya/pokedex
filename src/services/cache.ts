// Local storage caching utilities

export function fetchWithCache<T = any>(url: string, expiry = 24 * 60 * 60 * 1000): Promise<T> {
  // Only cache summary/list endpoints, not details
  const isSummaryEndpoint = /\/api\/v2\/pokemon\?limit=\d+&offset=\d+/.test(url);
  if (isSummaryEndpoint) {
    const cachedData = localStorage.getItem(url);
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < expiry) {
          return Promise.resolve(data);
        }
      } catch {}
    }
  }
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (isSummaryEndpoint) {
        try {
          localStorage.setItem(url, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (e) {
          // If quota exceeded, just skip caching
          console.warn('Cache quota exceeded, skipping cache for', url);
        }
      }
      return data;
    });
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