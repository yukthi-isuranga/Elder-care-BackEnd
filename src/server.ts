import app from './app';
import config from './config/config';
import './workers/email.worker'; // ✅ Initialize the worker

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
