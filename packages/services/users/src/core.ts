import { GecutLogger } from '@gecut/logger';
import { env } from '@gecut/utilities/env.js';
import { Database } from '@promeet/database';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger as honoLogger } from 'hono/logger';

import type { UserData } from '@promeet/types';

export const logger = new GecutLogger('users.service');
export const $exHono = new Hono<{ Variables: { user: UserData } }>();
export const $inHonoLogger = logger.sub('internal');
export const $inHono = new Hono();
export const db = new Database(
  'mongodb://root:m9zpx6DSV8Y1jNJFOlOaJuQHbAK63BTL@3c9eb54a-69d7-43bd-a87d-3478585093bc.hsvc.ir:30242/',
  logger.sub('db'),
  {
    appName: 'users-services',
  },
);

export const config = {
  host: env('HOST', '0.0.0.0', 'string'),
  port: env('PORT', 3130, 'number'),

  secret: {
    host: env('SECRET_HOST', '0.0.0.0', 'string'),
    port: env('SECRET_PORT', 3131, 'number'),
    token: env('SECRET_TOKEN', 'null', 'string'),
  },
};

$exHono.use(honoLogger(logger.property));
$inHono.use(honoLogger($inHonoLogger.property));

$inHono.use('/secrets/*', bearerAuth({ token: config.secret.token }));

$exHono.use(
  '/auth/*',
  bearerAuth({
    verifyToken: async (token, c) => {
      const user: UserData | null = await db.$user.findOne({ token });

      c.set('user', user);

      return user != null;
    },
  }),
);

$exHono.all('/', (c) => c.redirect('/health'));
$exHono.get('/health', (c) => c.text('OK!', 200));
