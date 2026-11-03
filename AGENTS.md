# AGENTS.md

## Project

Single-file Express 5 + MongoDB REST API for a travel/booking app. The entire app (routes, DB wiring, CORS, JSON handling) lives in `index.js`. No tests, lint, build, or CI.

## Run

- Run with `node index.js` — there is no `start` or `dev` script; the only npm script is a placeholder `test` that always exits 1.
- Requires Node >= 20.19 (constraint from the `mongodb` 7.x driver).
- Requires a `.env` in the repo root with `MONGODB_URI` (loading via `import "dotenv/config"` at the top of `index.js`). `.env` is gitignored. `PORT` is optional, defaults to 5000.

## Startup gotcha

`connectToMongoDB` (top-level await in `index.js`) catches errors and returns `undefined`, so if the DB is unreachable, the crash actually happens on the next line (`mongoClient.db(...)`) with a confusing "cannot read properties of undefined". If the server fails to start, check `MONGODB_URI` and DB reachability first.

## Express 5, not 4

Common Express 4 idioms throw in Express 5 — e.g. `app.get('*')` (use `'/*splat'` or a named regex) and old `res.sendfile` style APIs. Don't copy Express 4 snippets.

## Database (hardcoded in `index.js`)

- DB name is `wanderlust`, hardcoded — not configurable via `.env`.
- Collections: `destination` (singular) and `bookings` (plural). Keep the exact spelling when adding routes/queries.
- Route params like `:id` hold a hex id that must be wrapped: `new ObjectId(id)`.
- No auth or request-validation middleware exists; `POST /add-destination` and `POST /booking` insert bodies as-is.
