// deno-lint-ignore-file
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { handler } from '../_shared/handler.ts';

Deno.serve((req) =>
	handler(req, {
		GET() {
			return 'Greetings';
		},
	})
);