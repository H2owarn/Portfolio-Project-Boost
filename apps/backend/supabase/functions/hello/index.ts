// deno-lint-ignore-file
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { handler } from '../_shared/handler.ts';
import { NotFound, Unauthorized } from '../_shared/errors.ts';

Deno.serve((req) =>
	handler(req, {
		GET(res) {
			res.redirect = '/greetings'

			return 'Hi';
		},
		async POST() {
			const { name } = await req.json() as Record<string, any>;

			if (name !== 'Bob') throw new NotFound(`Couldn't find that user`);

			return {
				hello: `${name}!`
			};
		}
	})
);