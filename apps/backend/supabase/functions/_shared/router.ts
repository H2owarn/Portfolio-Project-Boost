import { MethodError } from './errors.ts';

import type { JSONValue, Method } from './types';

interface RequestWithParams extends Request {
	params: Record<string, string>;
}

interface ResponseConfig {
	headers: Headers;
	statusCode: number;
	redirect: (location: string, code?: number) => Response;
}

type MethodHandler = <T>(
	request: RequestWithParams,
	response: ResponseConfig
) => T | JSONValue | Response | Promise<T | JSONValue | Response>;

interface Route {
	method: Method;
	path: string;
	handler: MethodHandler;
	pattern: URLPattern;
	params: Record<string, any>;
}

export class Router {
	#routes: Route[] = [];
	#methods: Method[] = [];

	#addRoute(method: Method, path: string, handler: MethodHandler) {
		const fullPath = path.startsWith('/') ? path : '/' + path;

		this.#routes.push({ method, path: fullPath, handler, pattern: new URLPattern({ pathname: fullPath }), params: {} });
		if (!this.#methods.includes(method)) this.#methods.push(method);

		return this;
	}

	get(path: string, handler: MethodHandler) {
		return this.#addRoute('GET', path, handler);
	}
	post(path: string, handler: MethodHandler) {
		return this.#addRoute('POST', path, handler);
	}
	put(path: string, handler: MethodHandler) {
		return this.#addRoute('PUT', path, handler);
	}
	patch(path: string, handler: MethodHandler) {
		return this.#addRoute('PATCH', path, handler);
	}
	delete(path: string, handler: MethodHandler) {
		return this.#addRoute('DELETE', path, handler);
	}

	serve() {
		Deno.serve(async (req) => {
			const url = new URL(req.url);
			const pathname = '/' + url.pathname.split('/').slice(2).join('/');
			const method = req.method as Method;
			let selectedRoute: Route | null = null;
			let result: JSONValue | Response;
			let body = null;

			if (!this.#methods.includes(method)) {
				return new Response(`Method ${method} not allowed`, {
					status: 405,
					headers: { Allowed: this.#methods.join(', ') }
				});
			}

			for (const route of this.#routes) {
				// Exact match
				if (route.path === pathname && route.method === method) {
					selectedRoute = route;
					break;
				} else {
					// Not exact match, params must be present.
					const match = route.pattern.exec({ pathname });

					if (match && route.method === method) {
						selectedRoute = route;
						selectedRoute.params = match.pathname.groups;
						break;
					}
				}
			}

			if (!selectedRoute) {
				return new Response('Not Found', { status: 404 });
			}

			const requestWithParams = Object.assign(req, { params: selectedRoute.params });

			const res: ResponseConfig = {
				headers: new Headers(),
				statusCode: {
					GET: 200,
					POST: 201,
					PUT: 200,
					DELETE: 204,
					PATCH: 200
				}[method],
				redirect: (location: string, code?: number) => {
					console.log('start the redirect.');

					if (location.startsWith('/')) {
						console.log('redirect is relative.');

						const proto = req.headers.get('x-forwarded-proto')!;
						const host = req.headers.get('x-forwarded-host')!;
						const port = req.headers.get('x-forwarded-port')!;
						const prefix = req.headers.get('x-forwarded-prefix')!;

						const url = `${proto}://${host}:${port}${prefix}${location.slice(1)}`;
						console.log('redirect URL:', url);
						return Response.redirect(url, code);
					}

					return Response.redirect(location, code);
				}
			};

			try {
				result = await selectedRoute.handler(requestWithParams, res as ResponseConfig);
			} catch (error) {
				console.log(error);
				let body: MethodError | null = null;
				if (error instanceof MethodError) body = error;
				return new Response(JSON.stringify({ message: body?.message, status: body?.statusCode }), {
					status: body?.statusCode || 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}

			if (result instanceof Response) return result;
			else if (typeof result === 'string') {
				if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'text/plain');
				body = result;
			} else if (typeof result === 'object') {
				if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'application/json');
				body = JSON.stringify(result);
			}

			return new Response(body, { headers: res.headers, status: res.statusCode });
		});
	}
}
