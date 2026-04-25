// src/jobs/email.job.ts
import { emailQueue } from '../queues/email.queue';

export const sendApprovalEmailJob = async (payload: {
  to: string;
  name: string;
}) => {
  await emailQueue.add('send-approval-email', payload, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
};
