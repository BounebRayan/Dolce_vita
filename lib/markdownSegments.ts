/**
 * Split product description into plain markdown vs tiret (-) vs puce (•) list runs
 * so each can be styled differently on the storefront.
 */
export type MarkdownSegment =
  | { kind: "plain"; markdown: string }
  | { kind: "dashList"; items: string[] }
  | { kind: "dotList"; items: string[] };

export function parseMarkdownSegments(source: string): MarkdownSegment[] {
  const lines = source.split(/\r?\n/);
  const segments: MarkdownSegment[] = [];
  const plainBuf: string[] = [];

  const flushPlain = () => {
    if (plainBuf.length === 0) return;
    segments.push({ kind: "plain", markdown: plainBuf.join("\n") });
    plainBuf.length = 0;
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const dash = /^(\s*)-\s+(.*)$/.exec(line);
    const dot = /^(\s*)•\s+(.*)$/.exec(line);

    if (dash) {
      flushPlain();
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^(\s*)-\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        items.push(m[2]);
        i++;
      }
      if (items.length > 0) segments.push({ kind: "dashList", items });
      continue;
    }

    if (dot) {
      flushPlain();
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^(\s*)•\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        items.push(m[2]);
        i++;
      }
      if (items.length > 0) segments.push({ kind: "dotList", items });
      continue;
    }

    plainBuf.push(line);
    i++;
  }

  flushPlain();
  return segments;
}
