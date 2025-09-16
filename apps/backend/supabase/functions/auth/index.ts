import { Router } from '../_shared/router.ts';

new Router()
	.post('/login', async (req) => {
		const body = (await req.json()) as Record<string, string>;

		return body;
	})
	.post('/register', async (req) => {
		const body = (await req.json()) as Record<string, string>;

		return body;
	})
	.serve();
