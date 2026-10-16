# dogpostbot-discord · [![CI](https://github.com/JonnyPugh/dogpostbot-discord/actions/workflows/ci.yml/badge.svg)](https://github.com/JonnyPugh/dogpostbot-discord/actions/workflows/ci.yml)

Discord bot that posts dogs.

## Usage

In any channel the bot can see, send:

| Command   | Effect                          |
| --------- | ------------------------------- |
| `!dog`    | Posts one random dog.           |
| `!dog 5`  | Posts five random dogs (1–10).  |

Images come from the [dog.ceo API](https://dog.ceo/api/breeds/image/random).
Counts outside the 1–10 range fall back to a single dog.

## Setup

Requires Node.js 20.19+, 22.13+, or 24+ (CI runs on Node 24 LTS).

```sh
npm install
```

Create a Discord application and bot, enable the **Message Content Intent**
under *Bot → Privileged Gateway Intents* in the
[Discord developer portal](https://discord.com/developers/applications), then
expose the token:

```sh
export DISCORD_TOKEN=<Discord bot token>
npm start
```

`DISCORD_TOKEN` is the name discord.js itself reads by default, so no extra
wiring is needed.

## Available Scripts

- `npm start` — run the bot.
- `npm test` — run the unit tests.
- `npm run test:unit` — unit tests only (Node built-in test runner).
- `npm run test:e2e` — end-to-end tests against real Discord (see below).
- `npm run lint` — lint the source with ESLint.

## Testing

| Layer    | Command             | What it covers                                                        |
| -------- | ------------------- | --------------------------------------------------------------------- |
| **Unit** | `npm run test:unit` | Command parsing, dog API client, message handling — all mocked.       |
| **e2e**  | `npm run test:e2e`  | A real bot logs into Discord and posts a real dog. Skipped unless configured. |

### Running the e2e tests

1. Have a throwaway Discord server with a channel the bot can post in.
2. Set the two variables and run:

   ```sh
   export DISCORD_TOKEN=<Discord bot token>
   export DISCORD_TEST_CHANNEL_ID=<channel ID>
   npm run test:e2e
   ```

   Set `E2E_STRICT=1` to make a missing configuration fail instead of skip
   (this is what CI does).

## Docker

```sh
docker build . -t dogpostbot
docker run -e DISCORD_TOKEN=<Discord bot token> dogpostbot
```

[Docker Repository](https://hub.docker.com/r/jonnypugh/dogpostbot)

## CI/CD

[GitHub Actions](https://github.com/JonnyPugh/dogpostbot-discord/actions) runs
`.github/workflows/ci.yml`:

- **Pull requests** run `lint` → `unit tests`, the real-Discord `e2e` tests, and
  a Docker build with a startup smoke test.
- **Merges to `master`** run the same checks, then build and push the image to
  [Docker Hub](https://hub.docker.com/r/jonnypugh/dogpostbot) as `latest` and a
  short-SHA tag. The publish job is **gated on the e2e job**, so a failing e2e
  run blocks the image from being published.
- **Manual runs** — trigger the full pipeline (including `e2e`) from the Actions
  tab via *Run workflow* (the `workflow_dispatch` trigger).

`e2e` is skipped automatically for pull requests from forks (they cannot access
repository secrets). To make it a required check, add it under branch
protection for `master`.

### Required repository secrets

| Secret                    | Used by | Purpose                                      |
| ------------------------- | ------- | -------------------------------------------- |
| `DISCORD_TOKEN`           | `e2e`   | Bot token used by the e2e test.              |
| `DISCORD_TEST_CHANNEL_ID` | `e2e`   | Channel the e2e test posts into.             |
| `DOCKERHUB_USERNAME`      | `publish` | Docker Hub account for pushing the image.  |
| `DOCKERHUB_TOKEN`         | `publish` | Docker Hub access token (not your password). |

## License

[MIT](./LICENSE)
