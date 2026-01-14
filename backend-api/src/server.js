import 'dotenv/config';
import Fastify from 'fastify';
import closeWithGrace from 'close-with-grace';
import appService from './app.js';

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register the app logic (plugins, routes)
await app.register(appService);

// Graceful shutdown
closeWithGrace({ delay: 500 }, async ({ signal, err, manual }) => {
  if (err) {
    app.log.error(err);
  }
  await app.close();
});

try {
  await app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
