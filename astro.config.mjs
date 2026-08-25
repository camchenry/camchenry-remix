import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
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
      gfm: false,
      smartypants: false,
      remarkPlugins: [remarkGfm, [remarkToc, { heading: "Contents" }]],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeHighlight,
        rehypeRaw,
      ],
    }),
  },
  session: false,
});
