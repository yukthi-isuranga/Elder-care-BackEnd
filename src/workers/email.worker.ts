// src/workers/email.worker.ts
import { Worker } from 'bullmq';
import '../config/config'; // ✅ Ensure environment variables are loaded
import { redisOptions } from '../lib/redis';
import { sendApprovalEmail } from '../utils/mailer';

console.log('🚀 Email Worker initialized and waiting for jobs...');

export const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`📩 Job received: [${job.id}] ${job.name}`, job.data);

    try {
      if (job.name === 'send-approval-email') {
        const { to, name } = job.data;
        await sendApprovalEmail(to, name);
      }
    } catch (error) {
      console.error(`❌ Job ${job.id} failed with error:`, error);
      throw error; // Let BullMQ handle retries
    }
  },
  {
    connection: redisOptions,
  },
);

// Optional: Event listeners for better visibility
emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
