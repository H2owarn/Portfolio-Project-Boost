import { z, ZodAny } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.ts';
import type { JSONValue, Method } from './types.ts';

type ErrorHandler = (message?: string, additions?: Record<string, any>) => Response;

interface MethodObj<T extends object | undefined> {
	body: T extends { body: infer B } ? B : Record<string, any>;
	query: T extends { query: infer Q } ? Q : Record<string, any>;
	params: T extends { params: infer P } ? P : Record<string, any>;
	headers: Headers;
	request: Request;
	supabase: ReturnType<typeof createClient>;
	redirect: (location: string, code?: 301 | 302 | 303 | 307 | 308) => Response;
	status: (code: number) => void;
	error: {
		BadRequest: ErrorHandler;
		Unauthorized: ErrorHandler;
		NotFound: ErrorHandler;
		Forbidden: ErrorHandler;
		custom: (status: number, message: string, additions?: Record<string, any>) => Response;
	};
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
	#schemas: { path: string; method: Method; schema: z.ZodObject }[] = [];

	#supabase: ReturnType<typeof createClient>;

	constructor() {
		this.#supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
	}

	#addRoute(method: Method, path: string, handler: MethodHandler<any>, schema?: z.ZodObject) {
		if (schema && !this.#schemas.find((el) => el.path === path && el.method === method)) {
			this.#schemas.push({ path, method, schema });
		}
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
	#constructError(status: number, message: string, additions?: Record<string, any>) {
		return new Response(JSON.stringify({ status, message, ...additions }), {
			headers: { 'Content-Type': 'application/json' },
			status
		});
	}

	get<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>, schema?: z.ZodObject) {
		return this.#addRoute('GET', path, handler, schema);
	}
	post<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>, schema?: z.ZodObject) {
		return this.#addRoute('POST', path, handler, schema);
	}
	put<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>, schema?: z.ZodObject) {
		return this.#addRoute('PUT', path, handler, schema);
	}
	patch<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>, schema?: z.ZodObject) {
		return this.#addRoute('PATCH', path, handler, schema);
	}
	delete<T extends object | undefined = undefined>(path: string, handler: MethodHandler<T>, schema?: z.ZodObject) {
		return this.#addRoute('DELETE', path, handler, schema);
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

			const res: MethodObj<any> = {
				headers: new Headers(),
				query: this.#getQuery(req),
				body: {},
				params: selectedRoute.params,
				request: req,
				supabase: this.#supabase,
				status: (code: number) => (status = code),
				redirect: (location: string, code?: number) => {
					if (location.startsWith('/')) {
						const url = this.#getURL(req).href + location.slice(1);
						return Response.redirect(url, code);
					}

					return Response.redirect(location, code);
				},
				error: {
					BadRequest: (message, additions) => this.#constructError(400, message ?? 'Bad Request', additions),
					Unauthorized: (message, additions) => this.#constructError(401, message ?? 'Unautorized', additions),
					Forbidden: (message, additions) => this.#constructError(400, message ?? 'Forbidden', additions),
					NotFound: (message, additions) => this.#constructError(400, message ?? 'Not Found', additions),
					custom: (status, message, additions) => this.#constructError(status, message, additions)
				}
			};

			if (method !== 'GET' && req.headers.get('Content-Type') === 'application/json') {
				const jsonBody = (await req.json()) as Record<string, any>;
				const hasSchema = this.#schemas.find((el) => el.path === pathname && el.method === method);
				if (!hasSchema) res.body = jsonBody;
				else {
					const parsed = hasSchema.schema.safeParse(jsonBody);
					if (parsed.error) {
						return res.error.BadRequest('Validation error', { error: z.treeifyError(parsed.error) });
					}

					res.body = parsed.data;
				}
			}

			try {
				selectedReturn = await selectedRoute.handler(res);
			} catch (err) {
				return new Response('Internal Server Error', { status: 500 });
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
