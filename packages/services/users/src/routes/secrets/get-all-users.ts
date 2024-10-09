import { $inHono, db } from '../../core';

$inHono.get('/secrets/get.all.users', async (c) => {
  const users = await db.$user.find({}).exec();

  return c.json(users);
});
