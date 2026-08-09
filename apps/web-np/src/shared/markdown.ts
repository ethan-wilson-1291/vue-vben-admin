import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
});

/** Render raw markdown string to safe HTML */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  return md.render(content);
}
