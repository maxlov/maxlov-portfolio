# maxlov-portfolio

A static portfolio site built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

## Requirements

- **Node 22.23.4 or newer.** Astro 7 won't run on Node 20. Node 24 LTS is recommended, and `.nvmrc` pins it.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # output goes to dist/
npm run preview   # serves dist/
```

## Content

All content is Markdown with frontmatter, kept under `src/content/`. The schema is in `src/content.config.ts`.

> Astro 7 requires the config at `src/content.config.ts`. The legacy location `src/content/config.ts` is no longer supported.

### Projects: `src/content/projects/<slug>.md`

| field        | required | notes                                                                 |
|--------------|----------|-----------------------------------------------------------------------|
| `title`      | yes      |                                                                       |
| `slug`       | yes      | becomes the URL: `/projects/<slug>/`                                  |
| `summary`    | yes      | shown on the card and in the meta description                         |
| `coverImage` | yes      | path relative to the `.md` file, e.g. `./assets/<slug>/cover.png`     |
| `gallery`    | no       | list of image paths                                                   |
| `itchUrl`    | no       | adds an itch.io badge                                                 |
| `steamUrl`   | no       | adds a Steam badge                                                    |
| `tags`       | no       | list of strings                                                       |
| `videoId`    | no       | YouTube **ID** only (the part after `v=`), not the full URL. Replaces the cover image on the detail page |
| `date`       | yes      | `YYYY-MM-DD`                                                          |
| `featured`   | no       | featured projects sort first on the landing page                     |

Put images in `src/content/projects/assets/<slug>/`. Astro optimizes them at build time. Don't commit video files; use YouTube embeds instead.

### Devlogs: `src/content/devlogs/<any-name>.md`

| field     | required | notes                                                         |
|-----------|----------|---------------------------------------------------------------|
| `title`   | yes      |                                                               |
| `date`    | yes      | `YYYY-MM-DD`                                                  |
| `project` | yes      | must match an existing project `slug`, or the build fails     |
| `tags`    | no       |                                                               |

Each project's page lists its devlog entries. `/devlogs/` lists all of them, newest first.

### Obsidian

You can set this up in either of two ways:

1. **Dedicated vault.** Open `src/content/` as a vault. Set *Settings → Files & Links → Default location for new attachments* to `projects/assets`, and turn off *Use [[Wikilinks]]* so links stay as plain Markdown.
2. **Existing vault.** Symlink a folder in your vault to `src/content/devlogs` (on Windows, from an admin PowerShell):

   ```powershell
   New-Item -ItemType SymbolicLink -Path "C:\path\to\vault\Devlogs" -Target "C:\Users\maxwe\Frequent\Dev\maxlov-portfolio\src\content\devlogs"
   ```

`.gitignore` excludes Obsidian's per-machine workspace files.

## Deploying

1. Push to a GitHub repo named `maxlov-portfolio`.
2. Go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`.

**Before the custom domain is live:** the site is served from `https://<user>.github.io/maxlov-portfolio/`. Go to **Settings → Secrets and variables → Actions → Variables** and add these:

- `BASE_PATH` = `/maxlov-portfolio`
- `SITE_URL` = `https://<user>.github.io`

Delete both variables once the custom domain is working.

## Custom domain: maxlov.dev

The domain is set in `astro.config.mjs` (`site`) and `public/CNAME`. Deployments through Actions ignore CNAME; it's there for the record. The steps below are done in GitHub and at the registrar.

1. In **Settings → Pages → Custom domain**, enter `maxlov.dev` and save. GitHub sets the domain from this setting.
2. At your DNS provider, add the records for the apex domain. Use **either** an ALIAS/ANAME record pointing to `<user>.github.io` (if the provider supports it) **or** these four A records:

   ```
   A     @   185.199.108.153
   A     @   185.199.109.153
   A     @   185.199.110.153
   A     @   185.199.111.153
   ```

   Optionally, add IPv6 records too:

   ```
   AAAA  @   2606:50c0:8000::153
   AAAA  @   2606:50c0:8001::153
   AAAA  @   2606:50c0:8002::153
   AAAA  @   2606:50c0:8003::153
   ```

   Then add `www` as a `CNAME` pointing to `<user>.github.io`.
3. To protect against domain takeover, verify the domain under **GitHub → Settings (account) → Pages → Add a domain**.
4. Once DNS resolves, which can take up to 24h, tick **Enforce HTTPS**. `.dev` is HSTS-preloaded, so the site only loads over HTTPS. Until the certificate is issued, the domain shows a browser error, which is expected.

## Structure

```
src/
  content.config.ts        content schemas
  content/projects/        project .md files + assets/
  content/devlogs/         devlog .md files
  pages/                   index, projects/[slug], devlogs/index, devlogs/[slug]
  components/              ProjectCard, PlatformBadge, VideoEmbed, Gallery
  layouts/BaseLayout.astro
  styles/variables.css     design tokens; restyle from here
  styles/global.css        base element styles
```
