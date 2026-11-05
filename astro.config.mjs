import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";

export default defineConfig({
  site: "https://camchenry.com",
  trailingSlash: "never",
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "night-owl",
    },
    processor: unified({
      gfm: true,
      smartypants: false,
      remarkPlugins: [[remarkToc, { heading: "Contents" }]],
      rehypePlugins: [rehypeHeadingIds, rehypeAutolinkHeadings],
    }),
  },
  session: false,
});
