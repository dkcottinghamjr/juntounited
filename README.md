# Junto United

The intersection of Curiosity, Intelligence, and Ambition.

A static website built with Next.js (App Router), Tailwind CSS, and Framer Motion. Hosted on GitHub Pages.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a New Blog Post

1. Create a new `.md` file in `/content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2026-03-15"
excerpt: "A one or two sentence summary that appears on the card."
---

Your markdown content here.
```

2. Push to `main`. The post will appear automatically on the Conversation page.

The filename becomes the URL slug. For example, `my-new-post.md` becomes `/conversation/my-new-post`.

## Add a New Project Card

Edit `/content/projects.ts` and add an entry to the `projects` array:

```ts
{
  slug: 'your-project',
  name: 'Your Project',
  description: 'A 2-3 sentence description of the project.',
  status: 'Active',       // 'Active' | 'In Development' | 'Coming Soon'
  cta: 'Learn More',
}
```

## Deploy

Push to `main` — GitHub Actions builds the site and deploys it automatically.

The workflow (`.github/workflows/deploy.yml`) runs `npm run build` and deploys the `/out` directory using GitHub Pages.

## Connect a Custom Domain

1. Go to your repo's **Settings > Pages**
2. Under **Custom domain**, enter your domain (e.g., `juntounited.com`)
3. Configure your DNS provider:
   - For an apex domain: add `A` records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For a subdomain (e.g., `www`): add a `CNAME` record pointing to `<username>.github.io`
4. Check **Enforce HTTPS** once DNS propagates

GitHub will automatically create a `CNAME` file in the deployment. For more details, see the [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Tech Stack

- **Next.js 14** — App Router, static export
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — scroll animations
- **gray-matter + remark** — markdown blog posts at build time
- **next/font** — Cormorant Garamond + DM Sans, no runtime font API calls
