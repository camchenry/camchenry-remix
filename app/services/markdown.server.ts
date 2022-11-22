import langTypescript from "highlight.js/lib/languages/typescript";
import langXml from "highlight.js/lib/languages/xml";
import langCss from "highlight.js/lib/languages/css";
import langJavaScript from "highlight.js/lib/languages/javascript";
import langMarkdown from "highlight.js/lib/languages/markdown";
import langBash from "highlight.js/lib/languages/bash";

export async function convertMarkdownToHtml(
  markdownString: string,
  { onlyRenderMetadata = true }: { onlyRenderMetadata?: boolean } = {}
) {
  const { default: remarkToRehype } = await import("remark-rehype");
  const { default: remarkParse } = await import("remark-parse");
  const { default: rehypeStringify } = await import("rehype-stringify");
  const { default: remarkFrontmatter } = await import("remark-frontmatter");
  const { default: remarkParseFrontmatter } = await import(
    "remark-parse-frontmatter"
  );
  const { default: rehypeRaw } = await import("rehype-raw");
  const { default: rehypeHighlight } = await import("rehype-highlight");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkFootnotes } = await import("remark-footnotes");
  const { default: rehypeAutoLinkHeadings } = await import(
    "rehype-autolink-headings"
  );
  const { default: rehypeSlug } = await import("rehype-slug");
  const { unified } = await import("unified");

  // If `onlyRenderMetadata` is true, remove all non-frontmatter content
  // from the markdown string, and only return the frontmatter rendered.
  const startOfFrontmatter = markdownString.indexOf("---");
  const endOfFrontmatter = markdownString.indexOf(
    "---",
    startOfFrontmatter + 1
  );
  const stringToProcess = onlyRenderMetadata
    ? // Remove all content after the second "---" (the end of the frontmatter)
      markdownString.slice(0, endOfFrontmatter + 3)
    : markdownString;

  const processed = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkParseFrontmatter)
    .use(remarkGfm)
    .use(remarkFootnotes)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutoLinkHeadings)
    .use(rehypeHighlight, {
      languages: {
        typescript: langTypescript,
        xml: langXml,
        css: langCss,
        javascript: langJavaScript,
        markdown: langMarkdown,
        bash: langBash,
      },
      aliases: {
        typescript: ["ts", "typescript", "tsx"],
        javascript: ["js", "javascript", "jsx", "json"],
        xml: ["html", "xml", "xhtml", "svg", "mathml"],
        css: ["css", "scss", "sass"],
        markdown: ["md", "markdown"],
        bash: ["sh", "bash"],
      },
    })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(stringToProcess);

  return {
    html: processed.value.toString(),
    frontmatter: (processed.data as Record<string, unknown> | null)
      ?.frontmatter,
  };
}
