"use client";

import CopyButton from "./CopyButton";

export default function MarkdownContent({ content }: { content: string }) {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return (
            <div key={i} className="relative">
              <pre
                dir="ltr"
                className="bg-gray-900 text-gray-100 rounded-token p-4 pr-16 text-small leading-relaxed overflow-x-auto"
              >
                <code>{block.text}</code>
              </pre>
              <CopyButton text={block.text} />
            </div>
          );
        }
        if (block.type === "h2") {
          return (
            <h2 key={i} className="text-h2 font-bold text-ink mt-8 mb-2">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="text-body font-bold text-ink mt-6 mb-2">
              {block.text}
            </h3>
          );
        }
        if (block.type === "table") {
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full text-small border-collapse">
                <thead>
                  <tr>
                    {block.headers!.map((h, j) => (
                      <th
                        key={j}
                        className="border border-rule bg-gray-50 px-3 py-2 text-right font-bold text-ink"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows!.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className="border border-rule px-3 py-2 text-ink"
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: inlineFormat(cell),
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "hr") {
          return <hr key={i} className="border-rule my-6" />;
        }
        // paragraph
        return (
          <p
            key={i}
            className="text-ink leading-relaxed"
            dangerouslySetInnerHTML={{ __html: inlineFormat(block.text) }}
          />
        );
      })}
    </div>
  );
}

function inlineFormat(text: string): string {
  return text
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-ink px-1.5 py-0.5 rounded-token text-small font-mono">$1</code>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-accent hover:underline">$1</a>'
    );
}

interface Block {
  type: "h2" | "h3" | "code" | "paragraph" | "table" | "hr";
  text: string;
  headers?: string[];
  rows?: string[][];
}

function parseMarkdown(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    // HR
    if (line.trim() === "---") {
      blocks.push({ type: "hr", text: "" });
      i++;
      continue;
    }

    // h2
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace("## ", "") });
      i++;
      continue;
    }

    // h3
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace("### ", "") });
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && lines[i + 1]?.match(/\|[\s-|]+\|/)) {
      const headers = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean)
        );
        i++;
      }
      blocks.push({ type: "table", text: "", headers, rows });
      continue;
    }

    // Empty line — skip
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    blocks.push({ type: "paragraph", text: line });
    i++;
  }

  return blocks;
}
