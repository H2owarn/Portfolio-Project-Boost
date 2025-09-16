import { MethodError } from './errors.ts';

import type { JSONValue, Method } from './types';

interface MethodObj<T extends object | undefined> {
	body: T extends { body: infer B } ? B : Record<string, any>;
	query: T extends { query: infer Q } ? Q : Record<string, any>;
	params: T extends { params: infer P } ? P : Record<string, any>;
	headers: Headers;
	request: Request;
	redirect: (location: string, code?: 301 | 302 | 303 | 307 | 308) => Response;
	status: (code: number) => void;
}

type MethodHandler<T extends object | undefined> = (
	obj: MethodObj<T>
) => JSONValue | Response | Promise<JSONValue | Response>;

interface Route {
	method: Method;
	path: string;
	handler: MethodHandler<any>;
	pattern: URLPattern;
	params: Record<string, any>;
}

export class Router {
	#routes: Route[] = [];
	#methods: Method[] = [];

	#addRoute(method: Method, path: string, handler: MethodHandler<any>) {
		const fullPath = path.startsWith('/') ? path : '/' + path;

		this.#routes.push({ method, path: fullPath, handler, pattern: new URLPattern({ pathname: fullPath }), params: {} });
		if (!this.#methods.includes(method)) this.#methods.push(method);

		return this;
	}
	#getURL(req: Request) {
		const proto = req.headers.get('x-forwarded-proto')!;
		const host = req.headers.get('x-forwarded-host')!;
		const port = req.headers.get('x-forwarded-port')!;
		const prefix = req.headers.get('x-forwarded-prefix')!;

		return new URL(`${proto}://${host}:${port}${prefix}`);
	}
	#getQuery(req: Request) {
		const url = new URLSearchParams(req.url.split('?')[1]);
		return Object.fromEntries(url);
	}

	get<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>) {
		return this.#addRoute('GET', path, handler);
	}
	post<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>) {
		return this.#addRoute('POST', path, handler);
	}
	put<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>) {
		return this.#addRoute('PUT', path, handler);
	}
	patch<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>) {
		return this.#addRoute('PATCH', path, handler);
	}
	delete<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>) {
		return this.#addRoute('DELETE', path, handler);
	}

	serve() {
		Deno.serve(async (req) => {
			const url = new URL(req.url);
			const pathname = '/' + url.pathname.split('/').slice(2).join('/');
			const method = req.method as Method;

			let selectedRoute: Route | null = null;
			let selectedReturn: JSONValue | Response;
			let returnBody: string | null = null;
			let status = {
				GET: 200,
				POST: 201,
				PUT: 200,
				DELETE: 204,
				PATCH: 200
			}[method];
			let body: Record<string, any> = {};

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

			if (method !== 'GET' && req.headers.get('Content-Type') === 'application/json') {
				body = (await req.json()) as Record<string, any>;
			}

			const res: MethodObj<any> = {
				headers: new Headers(),
				query: this.#getQuery(req),
				body,
				params: selectedRoute.params,
				request: req,
				status: (code: number) => (status = code),
				redirect: (location: string, code?: number) => {
					if (location.startsWith('/')) {
						const url = this.#getURL(req).href + location.slice(1);
						return Response.redirect(url, code);
					}

					return Response.redirect(location, code);
				}
			};

			try {
				selectedReturn = await selectedRoute.handler(res);
			} catch (error) {
				console.log(error);
				let body: MethodError | null = null;
				if (error instanceof MethodError) body = error;
				return new Response(JSON.stringify({ message: body?.message, status: body?.statusCode }), {
					status: body?.statusCode || 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}

			if (selectedReturn instanceof Response) return selectedReturn;
			else if (typeof selectedReturn === 'string') {
				if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'text/plain');
				returnBody = selectedReturn;
			} else if (typeof selectedReturn === 'object') {
				if (!res.headers.has('Content-Type')) res.headers.set('Content-Type', 'application/json');
				returnBody = JSON.stringify(selectedReturn);
			}

			return new Response(returnBody, { headers: res.headers, status });
		});
	}
}
