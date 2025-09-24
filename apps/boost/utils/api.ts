import { type FetchRequestInit, fetch } from 'expo/fetch';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Routes = '/auth/login' | '/auth/register' | '/auth/refresh';
type Options = Omit<FetchRequestInit, 'body' | 'method'>;

export async function api<T extends Record<string, any>>(
	/** The HTTP method to be used when sending a request. */
	method: HTTPMethod,
	/** The Supabase edge function to send a request to. */
	route: Routes,
	/**
	 * Any data to be send to the request.\
	 * `GET` request must not have any data.
	 */
	body?: T,
	/**
	 * Any additonal options you wish to pass to the underlying `fetch` request.
	 */
	options?: Options
) {
	const apiURL = new URL(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1${route}`);

	console.log(apiURL);

	let headers: Record<string, string> = {
		Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
	};
	let finalOptions: FetchRequestInit = {
		method
	};

	if (method !== 'GET' && body) {
		finalOptions.body = JSON.stringify(body);
		if (!options?.headers) {
			headers['Content-Type'] = 'application/json';
		}
	}

	finalOptions.headers = {
		...options?.headers,
		...headers
	};

	const req = await fetch(apiURL.href, finalOptions);

	const data = await req.json();

	return {
		ok: req.ok,
		status: req.status,
		data
	};
}
