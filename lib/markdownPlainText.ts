/** Strip a small markdown/HTML subset for previews (cards, fallbacks). Not a full parser. */
export function markdownToPlainText(md: string): string {
  if (!md) return "";
  let t = md;
  t = t.replace(/<u\b[^>]*>([\s\S]*?)<\/u>/gi, "$1");
  t = t.replace(/\*\*([\s\S]*?)\*\*/g, "$1");
  t = t.replace(/\*([^*\n]+)\*/g, "$1");
  t = t.replace(/^[ \t]*[-*•]\s+/gm, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}
