import { startBot } from './src/bot.js';

startBot().catch((error) => {
  console.error('Failed to start dogpostbot', error);
  process.exitCode = 1;
});
