import { $exHono, $inHono, config, db, logger, $inHonoLogger } from './core';
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

    logger.methodFull?.(
      'server',
      { port: config.port, hostname: config.host },
      {
        id: externalServer.id,
        hostname: externalServer.hostname,
        port: externalServer.port,
        url: externalServer.url.href,
      },
    );

    const internalServer = Bun.serve({
      fetch: $inHono.fetch,
      port: config.secret.port,
      hostname: config.secret.host,
    });

    $inHonoLogger.methodFull?.(
      'server',
      { port: config.secret.port, hostname: config.secret.host },
      {
        id: internalServer.id,
        hostname: internalServer.hostname,
        port: internalServer.port,
        url: internalServer.url.href,
      },
    );
  });
