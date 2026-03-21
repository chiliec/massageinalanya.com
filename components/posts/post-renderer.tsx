import type { EditorContent, EditorBlock } from "@/lib/posts";

function renderInline(html: string) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderBlock(block: EditorBlock, index: number) {
  switch (block.type) {
    case "header": {
      const level = typeof block.data.level === "number" ? block.data.level : 2;
      const text = typeof block.data.text === "string" ? block.data.text : "";
      const Tag = level === 1 ? "h1" : level === 2 ? "h2" : level === 3 ? "h3" : "h4";
      const sizeClass =
        level === 1
          ? "text-3xl"
          : level === 2
            ? "text-2xl"
            : level === 3
              ? "text-xl"
              : "text-lg";
      return (
        <Tag key={block.id ?? index} className={`${sizeClass} font-semibold text-zinc-900 dark:text-zinc-50`}>
          {renderInline(text)}
        </Tag>
      );
    }
    case "paragraph": {
      const text = typeof block.data.text === "string" ? block.data.text : "";
      return (
        <p key={block.id ?? index} className="text-base leading-7 text-zinc-700 dark:text-zinc-200">
          {renderInline(text)}
        </p>
      );
    }
    case "list": {
      const style = block.data.style === "ordered" ? "ordered" : "unordered";
      const items = Array.isArray(block.data.items) ? block.data.items : [];
      const Tag = style === "ordered" ? "ol" : "ul";
      const listClass =
        style === "ordered"
          ? "list-decimal"
          : "list-disc";
      return (
        <Tag
          key={block.id ?? index}
          className={`${listClass} space-y-2 pl-6 text-base text-zinc-700 dark:text-zinc-200`}
        >
          {items.map((item, itemIndex) => (
            <li key={`${block.id ?? index}-${itemIndex}`}>{renderInline(String(item))}</li>
          ))}
        </Tag>
      );
    }
    case "quote": {
      const text = typeof block.data.text === "string" ? block.data.text : "";
      const caption = typeof block.data.caption === "string" ? block.data.caption : "";
      return (
        <blockquote
          key={block.id ?? index}
          className="border-l-2 border-zinc-300 pl-4 text-base italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          {renderInline(text)}
          {caption ? <footer className="mt-2 text-sm not-italic">{caption}</footer> : null}
        </blockquote>
      );
    }
    case "delimiter":
      return <hr key={block.id ?? index} className="my-6 border-zinc-200 dark:border-zinc-800" />;
    default:
      return null;
  }
}

export default function PostRenderer({ content }: { content: EditorContent }) {
  return <div className="space-y-4">{content.blocks?.map(renderBlock)}</div>;
}
