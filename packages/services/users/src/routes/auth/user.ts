import { $exHono } from '../../core';

$exHono.get('/auth/user', async (c) => c.json(c.get('user')));
