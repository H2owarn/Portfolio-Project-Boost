import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.ts';
import type { JSONValue, Method, Route, Context, MethodHandler, RouteSchema } from './types.ts';

/**
 * A helper class to achieve:
 * - Body parsing/validation.
 * - Sub routes
 * - URL query parsing/validation.
 * - URL parameter parsing/validation.
 *
 * @example
 * ```ts
 * new Router()
 * 	.get('/', () => 'Hello world!')
 * 	.post('/', ({ body }) => body)
 * 	.serve() // Don't forgot this!
 * ```
 */
export class Router {
	#routes: Route[] = [];
	#availableRoutes: { path: string; methods: Method[] }[] = [];
	#schemas: { path: string; method: Method; schema: RouteSchema }[] = [];

	#supabase: ReturnType<typeof createClient>;

	constructor() {
		this.#supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
	}

	/**
	 * Add a request to the router.
	 * @param method The method to added to the router.
	 * @param path The path the request will use.
	 * @param handler The function where all the logic of this route lives.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	#addRoute<T extends RouteSchema | undefined>(method: Method, path: string, handler: MethodHandler<any>, schema?: T) {
		if (schema && !this.#schemas.find((el) => el.path === path && el.method === method)) {
			this.#schemas.push({ path, method, schema });
		}
		const fullPath = path.startsWith('/') ? path : '/' + path;

		this.#routes.push({ method, path: fullPath, handler, pattern: new URLPattern({ pathname: fullPath }), params: {} });

		const foundRoute = this.#availableRoutes.find((el) => el.path === path);
		if (foundRoute) foundRoute.methods.push(method);
		else this.#availableRoutes.push({ path, methods: [method] });

		return this;
	}

	/**
	 * Creates a error response that can be returned.
	 * @param status The status to be sent.
	 * @param message The message to be sent.
	 * @param additions Any additional properties to be sent.
	 */
	#constructError(status: number, message: string, additions?: Record<string, any>) {
		return new Response(JSON.stringify({ status, message, ...additions }), {
			headers: { 'Content-Type': 'application/json' },
			status
		});
	}

	#parseZodError(error: z.ZodError) {
		const transformedErrors: Record<string, string[]> = {};

		for (const issue of error.issues) {
			const fieldName = issue.path[0]?.toString()!;

			if (fieldName !== undefined) {
				if (!transformedErrors[fieldName]) {
					transformedErrors[fieldName] = [];
				}
				transformedErrors[fieldName].push(issue.message);
			}
		}

		return transformedErrors;
	}

	/**
	 * Create a HTTP `GET` request.
	 * @param path The path to be used.
	 * @param handler The logic of the `GET` request.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	get<const T extends Omit<RouteSchema, 'body'>>(path: string, handler: MethodHandler<T>, schema?: T) {
		return this.#addRoute('GET', path, handler, schema);
	}
	/**
	 * Create a HTTP `POST` request.
	 * @param path The path to be used
	 * @param handler The logic of the `POST` request.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	post<const T extends RouteSchema>(path: string, handler: MethodHandler<T>, schema?: T) {
		return this.#addRoute('POST', path, handler, schema);
	}
	/**
	 * Create a HTTP `PUT` request.
	 * @param path The path to be used
	 * @param handler The logic of the `PUT` request.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	put<const T extends RouteSchema>(path: string, handler: MethodHandler<T>, schema?: T) {
		return this.#addRoute('PUT', path, handler, schema);
	}
	/**
	 * Create a HTTP `PATCH` request.
	 * @param path The path to be used
	 * @param handler The logic of the `PATCH` request.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	patch<const T extends RouteSchema>(path: string, handler: MethodHandler<T>, schema?: T) {
		return this.#addRoute('PATCH', path, handler, schema);
	}
	/**
	 * Create a HTTP `DELETE` request.
	 * @param path The path to be used
	 * @param handler The logic of the `DELETE` request.
	 * @param schema Optional Zod object to validate & parsed the request body, params, and queries.
	 */
	delete<const T extends RouteSchema>(path: string, handler: MethodHandler<T>, schema?: T) {
		return this.#addRoute('DELETE', path, handler, schema);
	}

	/**
	 * Allow the Supabase edge function to "start".
	 */
	serve() {
		Deno.serve(async (req) => {
			const url = new URL(req.url);
			const query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1]));
			const pathname = '/' + url.pathname.split('/').slice(2).join('/');
			const method = req.method as Method;
			const schemas = this.#schemas.find((el) => el.path === pathname && el.method === method);

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

			const validRoute = this.#availableRoutes.find((el) => el.path === pathname);
			if (!validRoute) return this.#constructError(404, 'Not Found');

			if (!validRoute.methods.includes(method)) {
				return new Response(`Method ${method} not allowed`, {
					status: 405,
					headers: { Allowed: validRoute.methods.join(', ') }
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

			const ctx: Context<any> = {
				headers: new Headers(),
				query,
				body: {},
				params: selectedRoute.params,
				request: req,
				supabase: this.#supabase,
				status: (code: number) => (status = code),
				redirect: (location: string, code?: number) => {
					if (location.startsWith('/')) {
						const proto = req.headers.get('x-forwarded-proto')!;
						const host = req.headers.get('x-forwarded-host')!;
						const port = req.headers.get('x-forwarded-port')!;
						const prefix = req.headers.get('x-forwarded-prefix')!;

						const url = `${proto}://${host}:${port}${prefix}` + location.slice(1);

						return Response.redirect(url, code);
					}

					return Response.redirect(location, code);
				},
				error: {
					BadRequest: (message, additions) => this.#constructError(400, message ?? 'Bad Request', additions),
					Unauthorized: (message, additions) => this.#constructError(401, message ?? 'Unautorized', additions),
					Forbidden: (message, additions) => this.#constructError(403, message ?? 'Forbidden', additions),
					NotFound: (message, additions) => this.#constructError(404, message ?? 'Not Found', additions),
					custom: (status, message, additions) => this.#constructError(status, message, additions)
				}
			};

			if (schemas) {
				if (method !== 'GET' && req.headers.get('Content-Type') === 'application/json') {
					const jsonBody = (await req.json()) as Record<string, any>;
					if (schemas.schema.body) {
						const parsed = schemas.schema.body.safeParse(jsonBody);
						if (parsed.error)
							return ctx.error.BadRequest('Validation error', { errors: this.#parseZodError(parsed.error) });
						else ctx.body = parsed.data;
					}
				}
				if (schemas.schema.query) {
					const parsed = schemas.schema.query.safeParse(query);
					if (parsed.error)
						return ctx.error.BadRequest('Validation error', { errors: this.#parseZodError(parsed.error) });
				}
				if (schemas.schema.params) {
					const parsed = schemas.schema.params.safeParse(ctx.params);
					if (parsed.error)
						return ctx.error.BadRequest('Validation error', { errors: this.#parseZodError(parsed.error) });
				}
			}

			try {
				selectedReturn = await selectedRoute.handler(ctx);
			} catch (err) {
				return new Response('Internal Server Error', { status: 500 });
			}

			if (selectedReturn instanceof Response) return selectedReturn;
			else if (typeof selectedReturn === 'string') {
				if (!ctx.headers.has('Content-Type')) ctx.headers.set('Content-Type', 'text/plain');
				returnBody = selectedReturn;
			} else if (typeof selectedReturn === 'object') {
				if (!ctx.headers.has('Content-Type')) ctx.headers.set('Content-Type', 'application/json');
				returnBody = JSON.stringify(selectedReturn);
			}

			return new Response(returnBody, { headers: ctx.headers, status });
		});
	}
}
