# Ethan Ellerstein - Portfolio

A monochrome studio portfolio with an iridescent accent system, a blog
that mixes native posts with links to articles published
elsewhere, and a contact form.

## Stack

- **Frontend:** React + Vite (JSX), CSS Modules, Framer Motion, React Router
- **Backend:** ASP.NET Core (.NET 10) minimal API - serves blog posts locally;
  not deployed in production (see below)
- **Contact form:** [Web3Forms](https://web3forms.com) - hosted form backend,
  called directly from the browser, no server required
- **Hosting:** Hostinger (shared/static), deployed via GitHub Actions

## Structure

```
client/                 # React app (Vite)
  src/studio/           # the site
    pages/              # Landing, BlogIndex, BlogPost
    components/         # Nav, Footer, Grain, Intro, Magnetic, ContactForm
    data/               # posts.js (local fallback), api.js (API + Web3Forms client)
server/                 # ASP.NET Core API (local/dev only - see Deployment)
  Program.cs            # endpoints: /api/posts, /api/posts/{slug}
  Data/posts.json       # blog content (file-backed; swap for a DB later)
docs/                   # design docs (creative brief, design-system prompt)
.github/workflows/      # CI/CD - build + deploy client to Hostinger
```

## Running locally

Two processes. From the repo root:

**1. API** (port 5050) - optional, only used as a fallback data source in dev
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
in the frontend. If the API is not running, the site still works - blog
content falls back to the bundled `client/src/studio/data/posts.js`.

The contact form always talks directly to Web3Forms, never the .NET API.
Create `client/.env.local` (gitignored) with:
```
VITE_WEB3FORMS_ACCESS_KEY=your-key-from-web3forms.com
```

## Production build

`npm run build` in `client/` runs three passes: the client build, an SSR
build, and `scripts/prerender.mjs`, which renders every route to static HTML
and generates `sitemap.xml` and `llms.txt` in `dist/`. Crawlers (including
AI crawlers, which don't run JavaScript) get full page content; the React
app takes over normally in the browser. Route metadata lives in
`client/src/studio/seo.js` - including the production domain constant.

## Deployment

Hostinger's plan here is shared hosting - it serves static files only, so
only the client's static build (`client/dist/`) is deployed. The .NET API
exists for local development (and as a demonstrated part of the stack) but
does not run in production; blog content ships baked into the prerendered
build, and the contact form bypasses the API entirely.

`.github/workflows/deploy.yml` builds `client/` on every push to `main` and
uploads `dist/` to Hostinger over FTP. Required GitHub repo secrets (Settings
→ Secrets and variables → Actions):

| Secret                     | Where to find it                                    |
|----------------------------|------------------------------------------------------|
| `FTP_SERVER`                | hPanel → Files → FTP Accounts                        |
| `FTP_USERNAME`               | hPanel → Files → FTP Accounts                        |
| `FTP_PASSWORD`               | hPanel → Files → FTP Accounts                        |
| `VITE_WEB3FORMS_ACCESS_KEY`  | web3forms.com (used at build time)                   |

## API

| Method | Route                | Purpose                          |
|--------|----------------------|----------------------------------|
| GET    | `/api/health`        | health check                     |
| GET    | `/api/posts`         | list posts (metadata, newest first) |
| GET    | `/api/posts/{slug}`  | single post (with body)          |
