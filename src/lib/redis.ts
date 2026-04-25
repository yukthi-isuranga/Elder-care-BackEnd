// src/lib/redis.ts
// import { Redis } from 'ioredis';

// export const redis = new Redis({
//   host: '127.0.0.1',
//   port: 6379,

//   // ✅ REQUIRED for BullMQ
//   maxRetriesPerRequest: null,
// });

// src/lib/redis.ts
import { RedisOptions } from 'ioredis';

export const redisOptions: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
};
