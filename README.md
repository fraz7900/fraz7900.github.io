# fraz7900.github.io

Fraz Ahmed's portfolio: product strategy, analytics and enterprise strategy.
It's a static Next.js App Router site (TypeScript, Tailwind, npm) exported to `out/` for GitHub Pages.

## Routes

| Route | Content |
| --- | --- |
| `/` | Introduction, ROI calculator preview, selected work |
| `/work/` | Published work index plus work in preparation (no links) |
| `/tools/workflow-roi/` | Full calculator, formula, assumptions, worked example |
| `/about/` | Short biography |
| `/work/caretrak/` | CareTrak case study: five-step walkthrough with annotated product mockups |
| `/work/pension-reform/` | Pension reform case study: five-step walkthrough with sourced exhibits |
| `/advising/…` | Advising: career, admissions, test prep, scholarships, stories, updates, booking. See [docs/advising-setup.md](docs/advising-setup.md) |

The CareTrak mockups are code-native (HTML/CSS in `src/components/case/`) and use synthetic data,
so they stay sharp at any zoom. Case copy lives in `src/content/caretrak.ts`. Source material and
4× PNG exports stay outside the repo, in the OneDrive `Website/case-drafts/` folder.

The export also contains `404.html`, `404/` and `_not-found/`. All three are Next.js copies of the
same `noindex` error page. GitHub Pages uses `404.html`, and the other two are harmless.

## Where to edit

- `src/content/site.ts`: name, headline, copy, navigation, and résumé link (`resumeHref`, `null` until a verified file is in `public/`)
- `src/content/work.ts`: published work and in-preparation entries
- `src/lib/roi.ts`: calculator model, field ranges and validation (the only place the math lives)
- `src/app/globals.css`: colour and font tokens

## Local development and preview

```bash
npm install
npm run dev            # http://localhost:3000 (dev server)
npm run build          # static export to out/
npm run preview        # serve out/ at http://127.0.0.1:4173 (needs python3)
```

## Checks

```bash
npm run lint
npm run typecheck
npm test               # Vitest: calculator, formatting, page search
npm run build
npx playwright install chromium   # first time only
npm run test:e2e       # Playwright + axe against out/ at desktop and phone widths
npm run check          # all of the above in order
```

## Deploying to GitHub Pages (when you choose to publish)

This repo is set up as a **user site** (`https://fraz7900.github.io/`), so the base path is empty.

1. Pages on a private repo needs GitHub Pro. Otherwise, make the repo public first and check
   that it contains nothing private.
2. In the repo, open **Settings → Pages → Build and deployment** and set **Source: GitHub Actions**.
3. Push `main`, then open **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow (`.github/workflows/deploy-pages.yml`) runs lint, type checks and unit tests, builds
`out/`, and deploys it. It only runs manually. Add `push: branches: [main]` under `on:` if you
want every push to deploy.

If the site is ever moved to a project repo (served from `/<repo>/`), set `basePath: "/<repo>"`
in `next.config.ts` and rerun the e2e tests against a server that mounts `out/` under that path.
