import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";

export default defineConfig({
  site: "https://camchenry.com",
  trailingSlash: "never",
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      gfm: true,
      smartypants: false,
      remarkPlugins: [[remarkToc, { heading: "Contents" }]],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeHighlight,
      ],
    }),
  },
  session: false,
});
