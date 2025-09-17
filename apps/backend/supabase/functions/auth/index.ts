import { ENV } from '../_shared/env.ts';
import { Router } from '../_shared/router.ts';

new Router()
	.post('/refresh', async ({ body, error }) => {
		const tokenUrl = new URL('/auth/v1/token?grant_type=refresh_token', ENV.SUPABASE_URL).toString();

		const res = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${ENV.SUPABASE_SERVICE_ROLE_KEY}`
			},
			body: JSON.stringify({ refresh_token: body.refresh_token })
		});

		if (!res.ok) return error.BadRequest('Invalid token.');

		const data = await res.json();

		return data;
		// return {
		// 	access_token: data.access_token,
		// 	refresh_token: data.refresh_token
		// };
	})
	.post('/register', async ({ body, supabase }) => {
		const register = await supabase.auth.signUp({
			email: body.email,
			password: body.password
		});

		return register;
	})
	.post('/login', async ({ body, supabase, error }) => {
		const login = await supabase.auth.signInWithPassword({
			email: body.email,
			password: body.password
		});

		if (login.error) return error.NotFound();

		return {
			access_token: login.data.session.access_token,
			refresh_token: login.data.session.refresh_token
		};
	})
	.post('/user', async ({ supabase, body, error }) => {
		const user = await supabase.auth.getUser(body.access_token);

		if (user.error) return error.Unauthorized('You must be logged in to view this route.');

		return user.data;
	})
	.serve();
