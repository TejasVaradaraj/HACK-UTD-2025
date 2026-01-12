/**
 * Simple in-memory cache with TTL support
 * Helps prevent rate limiting from external APIs
 */

class Cache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Get a cached value or fetch it if not present/expired
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data if cache miss
   * @param {number} ttlSeconds - Time to live in seconds (default: 60)
   * @returns {Promise<any>} - Cached or freshly fetched data
   */
  async getOrFetch(key, fetchFn, ttlSeconds = 60) {
    const cached = this.store.get(key);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      console.log(`📦 Cache HIT: ${key}`);
      return cached.data;
    }

    console.log(`🔄 Cache MISS: ${key} - fetching fresh data...`);
    const data = await fetchFn();
    
    this.store.set(key, {
      data,
      expiresAt: now + (ttlSeconds * 1000)
    });

    return data;
  }

  /**
   * Manually set a cache entry
   */
  set(key, data, ttlSeconds = 60) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }

  /**
   * Get a cache entry without fetching
   */
  get(key) {
    const cached = this.store.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    return null;
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key) {
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.store.clear();
  }

  /**
   * Get cache stats
   */
  stats() {
    const now = Date.now();
    let active = 0;
    let expired = 0;

    for (const [, value] of this.store) {
      if (value.expiresAt > now) {
        active++;
      } else {
        expired++;
      }
    }

    return { active, expired, total: this.store.size };
  }
}

// Export a singleton instance
export const cache = new Cache();

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  STATIC: 300,      // 5 minutes - for rarely changing data (network, couriers, cauldron info)
  DYNAMIC: 30,      // 30 seconds - for frequently changing data (levels)
  SHORT: 10         // 10 seconds - for very dynamic data
};

