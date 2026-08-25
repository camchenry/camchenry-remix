# camchenry.com

Personal site and blog built with Astro and deployed to Cloudflare Workers.

## Requirements

- Node.js 22.12 or newer
- npm 9.6.5 or newer

## Development

```sh
npm install
npm run dev
```

Posts are Markdown files in `posts/`. Create a draft from the existing template
with:

```sh
npm run new:post
```

## Validation

```sh
npm run check
npm run build
npm run preview
```

## Deployment

The site targets Cloudflare Workers. Cloudflare Workers Builds should use:

- Build command: `npm run build`
- Deploy command: `npm run deploy`

To deploy manually after authenticating Wrangler:

```sh
npm run build
npm run deploy
```
