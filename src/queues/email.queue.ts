// src/queues/email.queue.ts
// import { Queue } from 'bullmq';
// import { redis } from '../lib/redis';

// export const emailQueue = new Queue('email-queue', {
//   connection: redis,
// });

// src/queues/email.queue.ts
import { Queue } from 'bullmq';
import { redisOptions } from '../lib/redis';

export const emailQueue = new Queue('email-queue', {
  connection: redisOptions,
});
