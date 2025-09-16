import { Router } from '../_shared/router.ts';

new Router()
	.get('/', ({ query }) => query)
	.get('/redirect', ({ redirect }) => redirect('/auth'))
	.post('/login', async ({ body }) => {
		return body;
	})
	.post('/register', async ({ body }) => {
		return body;
	})
	.serve();
