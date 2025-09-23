const Redis = require('ioredis');

class Cache {
  constructor() {
    this.redis = null;
    this.isConnected = false;

    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.redis.on('error', (err) => {
        console.error('Redis connection error:', err);
        this.isConnected = false;
      });

      this.redis.on('connect', () => {
        console.log('Connected to Redis');
        this.isConnected = true;
      });

      this.redis.on('ready', () => {
        this.isConnected = true;
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isConnected = false;
    }
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) { // Default TTL: 1 hour
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async clearPattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis CLEAR PATTERN error:', error);
      return false;
    }
  }

  // Cache middleware for routes
  middleware(keyGenerator, ttl = 3600) {
    return async (req, res, next) => {
      // If Redis is not connected, skip caching
      if (!this.isConnected || !this.redis) {
        return next();
      }

      const key = keyGenerator(req);

      try {
        const cachedData = await this.get(key);
        if (cachedData) {
          return res.json(cachedData);
        }

        // Store original send method
        const originalSend = res.json;
        res.json = function(data) {
          // Cache the response
          this.set(key, data, ttl).catch(err => console.error('Cache set error:', err));
          return originalSend.call(this, data);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  }
}

module.exports = new Cache();
