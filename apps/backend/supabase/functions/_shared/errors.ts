export class MethodError extends Error {
	statusCode: number;

	constructor(message: string, code: number) {
		super(message);
		this.statusCode = code;
	}
}

/**
 * Sends a `401` response to the endpoint.
 */
export class Unauthorized extends MethodError {
	/**
	 * @param message The message to be sent in the response.
	 */
	constructor(message: string) {
		super(message, 401);
	}
}

/**
 * Sends a `403` response to the endpoint.
 */
export class Forbidden extends MethodError {
	/**
	 * @param message The message to be sent in the response.
	 */
	constructor(message: string) {
		super(message, 403)
	}
}

/**
 * Sends a `404` response to the endpoint.
 */
export class NotFound extends MethodError {
	/**
	 * @param message The message to be sent in the response.
	 */
	constructor(message: string) {
		super(message, 404);
	}
}
/**
 * Sends a `429` response to the endpoint.
 */
export class TooManyRequests extends MethodError {
	/**
	 * @param message The message to be sent in the response.
	 */
	constructor(message: string) {
		super(message, 429)
	}
}