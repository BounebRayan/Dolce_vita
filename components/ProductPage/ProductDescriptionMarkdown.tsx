import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import type { Components } from "react-markdown";
import { parseMarkdownSegments } from "@/lib/markdownSegments";

const sanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...defaultSchema.attributes,
    u: [],
  },
};

const rehypeSanitizeWithSchema: [typeof rehypeSanitize, Schema] = [
  rehypeSanitize,
  sanitizeSchema,
];
const rehypePlugins = [rehypeRaw, rehypeSanitizeWithSchema];
const remarkPlugins = [remarkGfm];

type Props = {
  children: string;
  className?: string;
};

function buildComponents(listItem: boolean): Components {
  const pClass = listItem
    ? "mb-0 last:mb-0 whitespace-pre-wrap leading-relaxed"
    : "mb-3 last:mb-0 whitespace-pre-wrap";
  return {
    p: ({ children: c }) => <p className={pClass}>{c}</p>,
    strong: ({ children: c }) => <strong className="font-semibold text-gray-900">{c}</strong>,
    em: ({ children: c }) => <em className="italic">{c}</em>,
    u: ({ children: c }) => <u className="underline underline-offset-2">{c}</u>,
    ul: ({ children: c }) => (
      <ul className="list-disc pl-5 mb-3 space-y-1 last:mb-0">{c}</ul>
    ),
    ol: ({ children: c }) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1 last:mb-0">{c}</ol>
    ),
    li: ({ children: c }) => <li className="whitespace-pre-wrap">{c}</li>,
  };
}

function MarkdownChunk({
  source,
  listItem,
}: {
  source: string;
  listItem?: boolean;
}) {
  const components = buildComponents(!!listItem);
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
      {source}
    </ReactMarkdown>
  );
}

export default function ProductDescriptionMarkdown({ children, className }: Props) {
  const raw = children ?? "";
  const segments = parseMarkdownSegments(raw);

  if (segments.length === 0) {
    return <div className={className ?? "text-gray-700 leading-relaxed"} />;
  }

  return (
    <div className={className ?? "text-gray-700 leading-relaxed"}>
      {segments.map((seg, idx) => {
        if (seg.kind === "plain") {
          return <MarkdownChunk key={idx} source={seg.markdown} />;
        }
        if (seg.kind === "dashList") {
          return (
            <ul
              key={idx}
              className="mb-3 space-y-2 last:mb-0 pl-0 list-none [&>li]:flex [&>li]:gap-2 [&>li]:items-start"
            >
              {seg.items.map((item, j) => (
                <li key={j} className="text-gray-700">
                  <span className="shrink-0 font-medium text-gray-900 select-none" aria-hidden>
                    -
                  </span>
                  <div className="min-w-0 flex-1">
                    <MarkdownChunk source={item} listItem />
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ul
            key={idx}
            className="list-disc pl-5 mb-3 space-y-2 last:mb-0 marker:text-gray-800"
          >
            {seg.items.map((item, j) => (
              <li key={j} className="whitespace-pre-wrap pl-1">
                <MarkdownChunk source={item} listItem />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
