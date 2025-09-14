import { MethodError, NotFound } from './errors.ts';
import type { JSONValue, Method } from './types';

interface ResponseConfig {
	headers: Headers;
	statusCode: number;
	redirect?: string | {location: string, statusCode: number}
}

type MethodHandler = (res: ResponseConfig) => JSONValue | Promise<JSONValue>;

interface Methods {
	GET?: MethodHandler;
	POST?: MethodHandler;
	DELETE?: MethodHandler;
	PUT?: MethodHandler;
	PATCH?: MethodHandler;
}

/**
 * A function to handle methods of edge function. 
 * @param req The request object from Deno.
 * @param methods The methods that are to be implemented in this
 */
export const handler = async (req: Request, methods: Methods) => {
	const method = req.method as Method;
	const allowed = Object.keys(methods);
	const res: ResponseConfig = {
		headers: new Headers(),
		statusCode: 0,
		redirect: undefined
	};

	if (method in methods) {
		let result: JSONValue;
		let body = null;

		try {
			result = await methods[method]!(res);
		} catch (err) {
			let body: MethodError | null = null;

			if (err instanceof MethodError) body = err;

			return new Response(JSON.stringify({ message: body?.message, status: body?.statusCode }), {
				status: body?.statusCode || 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (res.redirect) {
			const redirect = {
				location: typeof res.redirect === 'string' ? res.redirect : res.redirect.location,
				statusCode: typeof res.redirect === 'string' ? 301 : res.redirect.statusCode
			}

			const proto = req.headers.get('x-forwarded-proto')!;
			const host = req.headers.get('x-forwarded-host')!;
			const port = req.headers.get('x-forwarded-port')!;
			const prefix = req.headers.get('x-forwarded-prefix')!;

			if (redirect.location.startsWith('/')) {
				const url = `${proto}://${host}:${port}${prefix}${redirect.location.slice(1)}`;
				return Response.redirect(url, redirect.statusCode)
			}

			return Response.redirect(redirect.location, redirect.statusCode);
		}

		res.statusCode =
			res.statusCode ||
			{
				GET: 200,
				POST: 201,
				PUT: 200,
				DELETE: 204,
				PATCH: 200
			}[method];

		if (typeof result === 'string') {
			if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'text/plain');
			body = result;
		} else if (typeof result === 'object') {
			if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'application/json');
			body = JSON.stringify(result);
		}

		return new Response(body, { headers: res.headers, status: res.statusCode });
	}

	return new Response(`Method ${req.method} not allowed`, {
		status: 405,
		headers: { Allowed: allowed.join(', ') }
	});
};
