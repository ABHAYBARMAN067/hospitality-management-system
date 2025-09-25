// Cache helper - Redis is optional and disabled by default
// To enable Redis, set REDIS_URL in .env and ensure Redis server is running

const cache = {
  get: async (key) => {
    // Redis is disabled - always return null
    return null;
  },

  set: async (key, value, ttl = 3600) => {
    // Redis is disabled - no-op
    return;
  },

  del: async (key) => {
    // Redis is disabled - no-op
    return;
  },

  clearPattern: async (pattern) => {
    // Redis is disabled - no-op
    return;
  },
};

module.exports = cache;
