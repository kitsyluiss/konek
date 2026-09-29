# Konek Documentation

Welcome to the Konek documentation!

## What is Konek?

Konek is an **open-source visual builder** for creating beautiful "konek grid" style link-in-bio pages — similar to Linktree or Konek.me, but with one fundamental difference:

**You own everything.**

## Philosophy: Your Data, Your Hosting, Your Freedom

Most link-in-bio services work the same way: you create an account, build your page on their platform, and your content lives on their servers. If they shut down, raise prices, or change their terms — you lose everything.

**Konek takes a different approach.**

### 🔐 Your Data

- No account required
- No data sent to any server
- Everything stays in your browser's localStorage
- Export your work anytime as standard files

### 🏠 Your Hosting

- Deploy on **your** domain
- Host on **your** server (or any provider you choose)
- No vendor lock-in
- Switch hosting anytime without losing anything

### 🕊️ Your Freedom

- Open source (MIT License)
- No tracking, no analytics (unless you add your own)
- Modify the code however you want
- Self-host the builder itself if you prefer

**You're not renting a page. You're creating a website you fully own.**

---

## How It Works: 3 Simple Phases

Konek follows a straightforward workflow:

```
╔═══════════════════╗     ╔═══════════════════╗     ╔═══════════════════╗
║   PHASE 1         ║     ║   PHASE 2         ║     ║   PHASE 3         ║
║   BUILD           ║     ║   EXPORT          ║     ║   DEPLOY          ║
║                   ║     ║                   ║     ║                   ║
║   Use the visual  ║ ──► ║   Download your   ║ ──► ║   Host it         ║
║   builder to      ║     ║   complete        ║     ║   anywhere        ║
║   design your     ║     ║   project         ║     ║   you want        ║
║   konek page      ║     ║   (ZIP file)      ║     ║                   ║
╚═══════════════════╝     ╚═══════════════════╝     ╚═══════════════════╝
```

### Phase 1: Build

Use the **visual builder** to design your konek page:

- Drag-and-drop blocks on a 9×9 grid
- Add links, social profiles, images, videos, text
- Customize colors, backgrounds, and styles
- Preview on desktop and mobile
- No coding required

The builder runs **100% in your browser**. Your data is stored locally — no server, no account, no tracking.

### Phase 2: Export

When you're happy with your design, click **Export**.

Konek generates a **complete, standalone project**:

- Full source code (React + Vite + TypeScript + Tailwind)
- All your content and images
- Ready-to-use deployment configs
- Standard web technologies — nothing proprietary

**The exported project is completely independent.** It doesn't need Konek to run. It's your code now.

### Phase 3: Deploy

Take your project and deploy it **wherever you want**:

| Platform | Cost | Difficulty |
|----------|------|------------|
| Vercel | Free | ⭐ Easy |
| Netlify | Free | ⭐ Easy |
| GitHub Pages | Free | ⭐ Easy |
| Your own VPS | Varies | ⭐⭐ Medium |
| Docker | Varies | ⭐⭐ Medium |

Your konek is now live at **your own URL**, on **your own terms**.

---

## The Builder vs Your Konek

It's important to understand these are two separate things:

| | The Builder | Your Exported Konek |
|---|-------------|---------------------|
| **What is it?** | A tool to create koneks | Your personal website |
| **Where does it run?** | In your browser | On your hosting |
| **Who owns the data?** | You (localStorage) | You (your files) |
| **Can it disappear?** | You can self-host it | It's yours forever |

### Using the Builder

You have two options:

1. **Use the public instance** at [yoanbernabeu.github.io/konek](https://yoanbernabeu.github.io/konek/)
2. **Self-host your own** (see [Deploy Builder](/doc/builder/deploy))

Either way, your data never leaves your browser until you export it.

---

## Why Konek?

| Traditional Services | Konek |
|---------------------|-----------|
| Your page on their domain | Your page on **your** domain |
| Data on their servers | Data on **your** device |
| Monthly subscription | **Free forever** |
| They can shut down | **You control everything** |
| Limited customization | **Full source code access** |
| Vendor lock-in | **Export and leave anytime** |

---

## Documentation Sections

### 🛠️ Builder Setup

Install and deploy your own Konek Builder instance.

- [Quick Start](/doc/builder/quick-start) — Get running in 2 minutes
- [Installation](/doc/builder/installation) — Detailed installation guide
- [Configuration](/doc/builder/configuration) — Environment variables and options
- [Deploy Builder](/doc/builder/deploy) — Host your own instance

### 🎨 Using the Builder

Learn how to create your konek page.

- [Quick Start](/doc/usage/quick-start) — Create your first konek in 5 minutes
- [Block Types](/doc/usage/blocks) — All 7 block types explained
- [Analytics](/doc/usage/analytics) — Track visitors with Supabase

### 🚀 Export & Deploy Your Konek

Deploy your created konek to production.

- [Quick Start](/doc/export/quick-start) — Deploy in 5 minutes
- [Export Overview](/doc/export/overview) — What's included in the export
- [Vercel](/doc/export/vercel) — Deploy to Vercel
- [Netlify](/doc/export/netlify) — Deploy to Netlify
- [GitHub Pages](/doc/export/github-pages) — Free hosting with GitHub
- [Docker](/doc/export/docker) — Self-host with Docker

---

## Quick Links

- [GitHub Repository](https://github.com/yoanbernabeu/konek)
- [Report a Bug](https://github.com/yoanbernabeu/konek/issues)
- [Request a Feature](https://github.com/yoanbernabeu/konek/issues)

## License

Konek is open source, licensed under the **MIT License**. Use it, modify it, share it — it's yours.
