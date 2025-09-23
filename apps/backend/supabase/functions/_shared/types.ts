import type { z } from 'zod';
import type { createClient } from '@supabase/supabase-js';

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
export type JSONPrimitive = string | number | boolean | null | unknown;
export type JSONObject = {
	[key: string]: JSONValue;
};
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type InferSchemaPart<S extends RouteSchema | undefined, Part extends keyof RouteSchema> = S extends {
	[K in Part]: z.ZodObject<any>;
}
	? z.infer<S[Part]>
	: Record<string, string | any>;

export type MethodHandler<T extends RouteSchema> = (
	ctx: Context<T>
) => JSONValue | Response | Promise<JSONValue | Response>;

export interface RouteSchema {
	body?: z.ZodObject<any>;
	query?: z.ZodObject<any>;
	params?: z.ZodObject<any>;
}

export interface Route {
	method: Method;
	path: string;
	handler: MethodHandler<any>;
	pattern: URLPattern;
	params: Record<string, any>;
}

export type ErrorHandler = (message?: string, additions?: Record<string, any>) => Response;

export interface Context<T extends RouteSchema | undefined> {
	/**
	 * The data sent from the request.
	 * @example
	 * ```json
	 * {
	 * 	"email": "user@site.com",
	 * 	"password": "password123"
	 * }
	 * ```
	 * ```ts
	 * body.email // user@site.com
	 * body.password // password123
	 * ```
	 */
	body: InferSchemaPart<T, 'body'>;
	/**
	 * Any queries that are present in the URL.
	 * @example
	 * ```txt
	 * https://site.com/page?id=123&order=asc
	 * ```
	 * ```
	 * query.id // 123
	 * query.order // asc
	 * ```
	 */
	query: InferSchemaPart<T, 'query'>;
	/**
	 * The params that are present in the URL.
	 * @example
	 * ```txt
	 * https://site.com/users/:name
	 * ```
	 * ```
	 * params.name // Bob
	 * ```
	 */
	params: InferSchemaPart<T, 'params'>;
	/**
	 * Add headers to the new response.
	 */
	headers: Headers;
	/**
	 * The plain `Request` object.
	 */
	request: Request;
	/**
	 * The Supabase client.
	 * @example
	 * ```ts
	 * const users = await supabase.from('users').select('*');
	 * ```
	 */
	supabase: ReturnType<typeof createClient>;
	/**
	 * Redirect the user to another URL.\
	 * Any urls starting with `/` are relative paths. Meaning they go to\
	 * our own API.\
	 * URLs starting with `http://` are absolute and will go directly to that URL.
	 * @param location The location to send the user to.
	 * @param code The status code to be used.
	 */
	redirect: (location: string, code?: 301 | 302 | 303 | 307 | 308) => Response;
	/**
	 * Set the status code for the new response.
	 * @param code The status code.
	 */
	status: (code: number) => void;
	/**
	 * Helper functions to quickly return errors.
	 */
	error: {
		/**
		 * Sends a `400` response.\
		 * Used for client errors, such as failed validation.
		 * @param message The message to be sent.\
		 * @default
		 * "Bad Request"
		 */
		BadRequest: ErrorHandler;
		/**
		 * Sends a `401` response.\
		 * Used for if the user is not logged in.
		 * @param message The message to be sent.
		 * @default
		 * "Unauthorized"
		 */
		Unauthorized: ErrorHandler;
		/**
		 * Sends a `403` response.\
		 * Used for when we know who the user is, but they don't\
		 * have access to this route.
		 * @param message The message to be sent.
		 * @default
		 * "Forbidden"
		 */
		Forbidden: ErrorHandler;
		/**
		 * Sends a `404` response.\
		 * Used for if the resource/page/route is not found.
		 * @param message The message to be sent.
		 * @default
		 * "Not Found"
		 */
		NotFound: ErrorHandler;
		/**
		 * A custom handler for those status's that aren't yet listed.
		 * @param status The status code to be sent.
		 * @param message The message to be sent.
		 */
		custom: (status: number, message: string, additions?: Record<string, any>) => Response;
	};
}
