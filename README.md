# Boost

Boost is a gamified gym app built by a 4-person team in 4 weeks. The goal is to make exercise feel like a game — complete quests, earn XP, manage stamina, and compete with friends. 

<br>

---

<br>

## Development

1. Have [BunJS](https://bun.sh) installed.
    - Run `bun install` in your terminal at the root level of the repo to install all the dependencies.
2. Have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
    - Windows users: Inside your Docker Desktop settings, enable: "Expose daemon on tcp http://localhost:2375 without TLS"
        > If you do see this option, don't worry and skip this step.
3. Create a local supabase development environment.
    - I recommend watching [this video](https://www.youtube.com/watch?v=i1STOfZ-_R0) on how to set it up.
        - But instead of doing `npx`, use the bun alternative: `bunx`
4. Login to your supabase account via the `bunx supabase login` command.
5. Link your supabase remote to local development by using:
    ```
    bunx supabase link --project-ref <PROJECT ID>
    ```
5. Set up your Expo environment for React Native.
    - Read [their docs](https://docs.expo.dev/get-started/set-up-your-environment/)
