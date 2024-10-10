import { $exHono, $inHono, config, db } from './core';
import './routes/auth/user';
import './routes/secrets/get-all-users';

db.connect()
  .then(() => db.initialize())
  .then(() => {
    const externalServer = Bun.serve({
      fetch: $exHono.fetch,
      port: config.port,
      hostname: config.host,
    });

    const internalServer = Bun.serve({
      fetch: $inHono.fetch,
      port: config.secret.port,
      hostname: config.secret.host,
    });

    // eslint-disable-next-line no-console
    console.log('externalServer', {
      url: externalServer.url.toString(),
    });

    // eslint-disable-next-line no-console
    console.log('internalServer', {
      url: internalServer.url.toString(),
    });
  });
