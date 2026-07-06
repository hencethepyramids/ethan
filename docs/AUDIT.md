# Production Audit — Ethan Ellerstein Portfolio

*Audit date: 2026-07-05 · Scope: entire repo (client + server), plus live probing of the running
API and dev server. The codebase is ~20 source files, so this report lists **every** meaningful
finding rather than padding to fixed list lengths.*

---

## Executive summary

The bones are genuinely good: a clean React/Vite front-end with a disciplined design system, a
tidy ASP.NET Core minimal API, graceful API-down fallbacks, current dependencies (0 npm
vulnerabilities), and React's escaping + System.Text.Json's escaping held up under live injection
and traversal probing — no XSS, no path traversal, no JSONL corruption.

What blocks shipping is not the engineering, it's four things:

1. **Dead placeholder social links** (`github.com`, `linkedin.com`, `x.com` roots) — instant
   credibility loss with recruiters.
2. **Placeholder content presented as real work** — projects with no repos/demos, stats that read
   as invented, and `posts.js` literally opens with "Placeholder content".
3. **An unbounded, unthrottled contact endpoint** — a 2 MB message was accepted and written to
   disk during this audit (verified live); a bot can fill the disk.
4. **No version control** — the repo is not a git repository.

Estimated effort to clear everything below: **2–3 focused days** (≈ half day content, half day
backend hardening, half day a11y/SEO, half day deploy config + git, remainder misc).

### Scores (0–10)

| Category | Score | One-line justification |
|---|---|---|
| Production readiness | 5 | Runs great locally; content, hardening, and deploy config not ready |
| Architecture | 7 | Clean separation, right-sized; dual content source is the main wart |
| Frontend | 7 | Idiomatic React 19, clean composition; a few correctness bugs |
| Backend | 5.5 | Correct REST semantics; missing limits, rate limiting, logging |
| Security | 5 | No injection/XSS/traversal found; unbounded input + no headers/rate limit |
| Performance | 6 | 130 KB gzip single chunk; font `@import`; many infinite `filter` animations |
| Accessibility | 5 | No label association, no reduced-motion, no aria-live, SR noise |
| SEO | 4 | Good title/desc; no og:image, canonical, robots.txt, sitemap, per-page meta |
| Maintainability | 7 | Small, consistent, readable; minor duplication |
| Code quality | 7 | Consistent idiom; magic timeouts, TZ-naive dates |
| Portfolio impression | 4 today | Visual polish is high; authenticity gaps undo it |

---

## CRITICAL

### C1. Social links point at placeholder domains
- **File:** `client/src/studio/components/Socials.jsx:15-19`
- **Impact:** A recruiter clicking GitHub lands on github.com's homepage. On a portfolio this is
  the single most damaging bug on the site. It reads as "shipped without checking".
- **Fix:** Point at real profiles, or remove icons for profiles that don't exist. Blocks launch.
- **Confidence:** 100%.
- *Update 2026-07-05: GitHub now points at the real profile. LinkedIn and X still placeholders —
  fix or remove before launch.*

### C2. Placeholder projects/blog presented as real work
- **Files:** `client/src/studio/data/projects.js` (all 5 projects), `client/src/studio/data/posts.js:1`
  ("Placeholder content" comment), `Landing.jsx:51-56` (STATS: "5+ years", "20+ projects").
- **Impact:** Hiring managers verify claims. Five projects with no links, no screenshots, no
  repos, and interchangeable copy read as fabricated — worse than an empty section. The stats
  block invites the exact question you don't want asked in a screen.
- **Fix:** Replace with 2–3 real projects (Watchwall is real — use it) with repo/demo links;
  keep only stats you can defend. Blocks launch.
- **Confidence:** 95% (content authenticity is yours to confirm).
- *Update 2026-07-05: projects replaced with Watchwall (linked to watchwall.app). Still open:
  the STATS block and the blog posts' authenticity are Ethan's to confirm.*

## HIGH

### H1. Contact endpoint accepts unbounded input with no rate limiting — disk-fill DoS
- **File:** `server/Program.cs:46-69`
- **Verified live:** a 2,000,000-character message returned `200 OK` and appended 2 MB to
  `contact-messages.jsonl`. Kestrel's default 28.6 MB body cap is the only limit, and there is no
  per-IP throttle, honeypot, or duplicate suppression.
- **Fix:** Enforce max lengths (e.g. name ≤ 100, email ≤ 254, message ≤ 5,000), add
  `AddRateLimiter` (e.g. fixed window, 5 req/min/IP) on `/api/contact`, and consider a honeypot
  field. Blocks production.
- **Confidence:** 100% (reproduced).

### H2. Every blog date renders one day early in US timezones
- **File:** `client/src/studio/data/posts.js:74-75` (`fmtDate`)
- **Verified:** `new Date('2026-05-18')` parses as UTC midnight; `toLocaleDateString` in
  `America/Chicago` renders **"May 17, 2026"**. Every date on the site is off by one for most US
  visitors — the kind of bug a sharp interviewer catches in a minute.
- **Fix:** Parse as local date (`new Date(y, m-1, d)`) or format with `timeZone: 'UTC'`.
- **Confidence:** 100% (reproduced).

### H3. Posts added on the server are unreachable in the client
- **File:** `client/src/studio/pages/BlogPost.jsx:23-30`
- **Why:** initial state is `getPost(slug)` from the *bundled* data; if the slug only exists in
  `server/Data/posts.json`, `post` is null on first render and the component immediately
  `<Navigate>`s to `/blog` before the API fetch can resolve. The stated architecture ("swap in
  the API without touching components") doesn't hold for new posts.
- **Fix:** Add a `loading` state: fetch first, fall back to local, redirect only after both miss.
- **Confidence:** 95% (code-path analysis).

### H4. No version control — *resolved 2026-07-05: repo initialized and published to
github.com/hencethepyramids/ethan (public)*
- **Impact:** No history, no rollback, no PR-based review, and `/code-review ultra` can't run.
  For a portfolio, the *repo itself* is an exhibit — recruiters read commit history.
- **Fix:** `git init`, commit in coherent chunks. Root `.gitignore` should also cover `docs/`
  exclusions if any, `*.user`, etc. (client/ and server/ .gitignore files are already sound —
  `contact-messages.jsonl` is correctly excluded.)

### H5. Contact content is duplicated in two sources of truth
- **Files:** `client/src/studio/data/posts.js` ↔ `server/Data/posts.json`
- **Why it matters:** every edit must be made twice; they *will* drift (H3 makes the drift
  user-visible). Fine as a deliberate fallback, but needs a single canonical source with a build
  step that generates the other, or accept the API as canonical and slim the fallback.

## MEDIUM

### M1. Missing security headers everywhere
No CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or HSTS on either the
API responses or the static host plan. On Hostinger (Apache/LiteSpeed), set these in `.htaccess`;
on the API, add a small middleware. A security-branded portfolio with no CSP is an easy ding from
exactly the audience you're courting.

### M2. Deployment configuration is dev-only
- `server/Program.cs:4` — `UseUrls("http://localhost:5050")` hardcodes the binding and overrides
  `ASPNETCORE_URLS`; remove it and configure per-environment.
- `Program.cs:7-10` — CORS allows only localhost origins; fine if the API is reverse-proxied
  same-origin in prod (then CORS is unnecessary), broken if it's on a subdomain.
- SPA deep links (`/blog/x`, `/work/x`) will 404 on static hosting without an `.htaccess`
  rewrite to `index.html`.
- Note: Hostinger *shared* hosting cannot run .NET — the API needs their VPS tier or another
  host. Decide before building more on the API.

### M3. No React error boundary
Any render error blank-screens the entire site (`main.jsx` renders `App` bare). Add one error
boundary with a styled fallback — it's ~20 lines and reads as senior judgment.

### M4. Contact form accessibility
`ContactForm.jsx:40-53`: labels are not associated (`htmlFor`/`id` missing), inputs have no
`name` or `autocomplete` attributes (breaks browser autofill — verified none exist in `src/`),
and the error/success status is not announced (`aria-live` absent). Screen-reader users get
placeholder text only.

### M5. No `prefers-reduced-motion` support
Zero matches in the codebase. The site runs ~20 infinite `hue-rotate` filter animations, a
marquee, spring scroll progress, and a forced 2.4 s intro (1.5 s count + 0.9 s lift, every new
session — `Intro.jsx`). Add a global reduced-motion block that disables the loops and skips the
intro; also consider honoring it in Framer Motion via `useReducedMotion`/`MotionConfig`.

### M6. Google Fonts via CSS `@import`
`studio.css:1` — discovered only after CSS parses (render-blocking, late font fetch, layout
shift risk). Move to `<link rel="preconnect">` + `<link rel="stylesheet">` in `index.html`, or
better, self-host the three families (also removes the third-party request — a GDPR nicety and
one less external dependency).

### M7. SEO package is half-finished
`index.html` declares `twitter:card summary_large_image` with **no image**; no `og:image`,
`og:url`, canonical URL, `robots.txt`, or `sitemap.xml` (public/ contains only favicon.svg and
icons.svg); no per-route meta (blog posts share the homepage description); no structured data
(a `Person` + `BlogPosting` JSON-LD block is cheap and on-brand). Client-rendered content is fine
for Google but thin for other crawlers/link unfurlers — the OG image is what shows when the site
is shared in Slack/LinkedIn, which for a portfolio is a primary distribution channel.

### M8. Contact messages go to a file nobody watches
Submissions land in a JSONL on the server with no email notification, no admin view, and no
backup story. Functionally, messages will be discovered weeks late. Wire an SMTP/transactional
email send (with the JSONL kept as an audit log), or at minimum document the retrieval process.

### M9. Single 405 KB bundle (130 KB gzip), no code splitting
All routes + all of framer-motion in one chunk. `React.lazy` the three secondary routes and use
Motion's `LazyMotion`/`m` to drop the full `motion` runtime; realistic target is ~70–80 KB gzip
initial. Not a blocker at this size, but it's a visible craft signal.

### M10. Theme flash on first paint
`theme.jsx` sets `data-theme` in a React effect, so dark-mode users get a light flash on every
load. Add a 3-line inline script in `index.html` `<head>` that sets `data-theme` before paint.
Related: `theme-color` meta is hardcoded to the dark value regardless of active theme.

## LOW

- **L1.** `setTimeout(…, 80)` navigation-then-scroll hack duplicated in `StudioNav.jsx:48` and
  `WorkDetail.jsx:33` — race-prone on slow devices; use a scroll-to-hash effect on the landing
  page instead of timers.
- **L2.** Duplicated `Block` component (`BlogPost.jsx:15-19` = `WorkDetail.jsx:14-18`) and the
  `ease` constant redeclared in six files — extract once.
- **L3.** `api.js:20` interpolates `slug` into the URL without `encodeURIComponent`.
- **L4.** Dead weight: `public/icons.svg` is referenced nowhere; `typescript` devDependency +
  `tsconfig.json` in a JS-only project (nothing compiles TS). Remove or actually adopt TS.
- **L5.** `BlogPost.jsx:32-33` — "next post" is computed from bundled `POSTS`, so it ignores
  API-served ordering and would crash if the fallback list were ever emptied.
- **L6.** Marquee (`Landing.jsx:111-122`): decorative `✦` separators and the duplicated track are
  read aloud by screen readers ("black four-pointed star" × 18). `aria-hidden` the duplicate run
  and the dots.
- **L7.** Mobile menu: no Escape-to-close, no focus management on open.
- **L8.** ~~`StudioNav` re-renders every second for the clock and the scroll listener isn't
  `{ passive: true }`.~~ *Resolved 2026-07-05: clock removed, listener made passive.*
- **L9.** `LoadPosts()` does synchronous `File.ReadAllText` per request with no caching and no
  try/catch — a corrupt `posts.json` turns every blog endpoint into an empty 500 (client fallback
  masks it, but log it). Cache with a file-watcher or `IMemoryCache`.
- **L10.** No favicon fallbacks (`.ico`, `apple-touch-icon`) — SVG-only favicons miss Safari
  pinned tabs and some crawlers.
- **L11.** Inputs use `outline: none` (`studio.module.css:324`) with a border-image focus
  replacement — acceptable contrast-wise, but verify the border change meets 3:1 against the
  resting state; everything else relies on default outlines (fine).
- **L12.** `.claude/settings.local.json` — confirm nothing sensitive before the repo goes public.

## INFO

- Server correctly returns 404 (unknown slug/route), 400 (missing fields, malformed JSON, JSON
  `null`), 415 (wrong content type); traversal attempts (`..%2F..%2F`) are neutralized by route
  binding — all verified live. No stack traces leak in Production mode.
- JSONL newline-injection attempt was safely escaped by System.Text.Json — verified live.
- Over-posting is a non-issue: the record type whitelists Name/Email/Message.
- No cancellation tokens or request logging on the API — fine at this scale, add with growth.
- No tests of any kind. For a portfolio, even 5–6 API integration tests
  (`WebApplicationFactory`) + a couple of component tests are a strong hiring signal; their
  absence is a talking point you don't want.
- Machine: .NET SDK is `10.0.100-rc.2` (a pre-GA release candidate) with patch 10.0.109
  available — update the SDK before publishing builds from this machine.
- Dependencies: npm packages updated 2026-07-05, `npm audit` clean.

---

## Pass 2 — Staff-engineer read

**What reads senior:** the API-down fallback strategy in `api.js` (site degrades to fully
functional static); the restrained, systematized design language and its documented rationale;
route/model binding hygiene on the server; StrictMode; content modeled as typed blocks rather
than raw HTML (this is *why* there's no XSS surface — `dangerouslySetInnerHTML` appears nowhere);
current React 19/Vite 8 stack.

**What reads junior:** shipped placeholder content and dead links; timezone-naive date handling;
`setTimeout` as a navigation-coordination primitive; the fallback-first data flow that
contradicts its own stated goal (H3); no input bounds on the one write endpoint; no tests; no
git. None of these are hard to fix — which is exactly why leaving them in is costly: they look
like choices.

**Would I trust this engineer on a production team?** On the evidence of structure and taste,
yes, provisionally — the architecture is right-sized, not over-engineered. The gap is
*verification discipline*: the bugs found here are all "did you click it / did you check the
output" bugs, and the audit's live probing found them in minutes.

## Pass 3 — Hiring-manager read

The visual impression in the first five seconds is strong — distinctive, restrained, clearly not
a template. That buys you the click on "Selected Work"… where the illusion currently collapses
(no links, no artifacts, interchangeable copy). A hiring manager spends 90 seconds here: make
Work → real repos/demos, GitHub → real profile, and the site converts. The blog content is
actually good and on-message ("range is the point" is a coherent narrative across all four
posts) — if those posts are genuinely yours, they're the strongest asset on the site. Fix
C1/C2/H2 and this moves from "pretty but hollow" to "top-decile candidate site".

## Launch checklist (ordered)

1. Real social links + real projects with links (C1, C2)
2. `git init` + initial commits (H4)
3. Contact hardening: lengths + rate limit + honeypot (H1)
4. Date fix (H2) · blog fetch-before-redirect (H3)
5. Form a11y: labels/name/autocomplete/aria-live (M4) · reduced-motion (M5)
6. SEO: og:image, canonical, robots.txt, sitemap, JSON-LD (M7)
7. Error boundary (M3) · theme pre-paint script (M10)
8. Fonts self-hosted or `<link>`-loaded (M6) · route code-splitting (M9)
9. Deploy config: remove UseUrls, decide Hostinger VPS vs. alternative, `.htaccess`
   SPA rewrite + security headers (M1, M2)
10. Sweep the LOW list; add a handful of API tests
