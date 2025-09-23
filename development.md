# Development guide

### Prerequisites

- [BunJS](https://bun.sh)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A [Supabase](https://supabase.com) account & project.
- Expo Go - [view their docs](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Deno VSCode](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) extension.

### Running

1. Run `bun install` in the root of the repo to install dependencies.
2. Move into the `backend` directory with:

   ```
   cd apps/backend
   ```

3. Sign in to your supabase account by running:

   ```
   bunx supabase login
   ```

   And follow the prompts.

4. Link to the remote supabase project by running:

   ```
   bunx supabase link
   ```

   And selecting the project.

5. Install the supabase local development by running:

   ```
   bunx supabase start
   ```

   - This will download/install & run the supabase local environment inside docker.

6. Run:

   ```
   bunx supabase db reset
   ```

   To push the migrations to your local environment.

Now that the backend _should_ be setup, we're now able to run the Expo app.

Simply run:

```
cd ../../apps/boost

bun start
```

If you're using a physical device there will be a QR code in the terminal, scan that QR code when the Expo Go app.

And you're done!
