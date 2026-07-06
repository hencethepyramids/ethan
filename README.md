# Ethan Ellerstein - Portfolio

A monochrome studio portfolio with an iridescent accent system, a blog
("Journal"), and a contact form - backed by an ASP.NET Core API.

## Stack

- **Frontend:** React + Vite (JSX), CSS Modules, Framer Motion, React Router
- **Backend:** ASP.NET Core (.NET 10) minimal API
- **Hosting:** Hostinger (planned)

## Structure

```
client/                 # React app (Vite)
  src/studio/           # the site
    pages/              # Landing, BlogIndex, BlogPost
    components/         # Nav, Footer, Grain, Intro, Magnetic, ContactForm
    data/               # posts.js (local fallback), api.js (API client)
server/                 # ASP.NET Core API
  Program.cs            # endpoints: /api/posts, /api/posts/{slug}, /api/contact
  Data/posts.json       # blog content (file-backed; swap for a DB later)
docs/                   # design docs (creative brief, design-system prompt)
```

## Running locally

Two processes. From the repo root:

**1. API** (port 5050)
```bash
cd server
dotnet run
```

**2. Client** (port 5173) - in a second terminal
```bash
cd client
npm install   # first time only
npm run dev
```

Then open http://localhost:5173.

Vite proxies `/api/*` to the .NET server, so there's no CORS or hardcoded URLs
in the frontend. If the API is not running, the site still works - blog content
falls back to the bundled `client/src/studio/data/posts.js`, and the contact
form surfaces a friendly error pointing to the email link.

## Production build

`npm run build` in `client/` runs three passes: the client build, an SSR
build, and `scripts/prerender.mjs`, which renders every route to static HTML
and generates `sitemap.xml` and `llms.txt` in `dist/`. Crawlers (including
AI crawlers, which don't run JavaScript) get full page content; the React
app takes over normally in the browser. Route metadata lives in
`client/src/studio/seo.js` - including the production domain constant.

## API

| Method | Route                | Purpose                          |
|--------|----------------------|----------------------------------|
| GET    | `/api/health`        | health check                     |
| GET    | `/api/posts`         | list posts (metadata, newest first) |
| GET    | `/api/posts/{slug}`  | single post (with body)          |
| POST   | `/api/contact`       | submit contact form              |

Contact submissions are appended to `server/Data/contact-messages.jsonl`.
