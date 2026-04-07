"use client";

import { useRef } from "react";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsListUl,
  BsCircleFill,
} from "react-icons/bs";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  id?: string;
};

function applyWrap(
  value: string,
  start: number,
  end: number,
  open: string,
  close: string
): { newValue: string; selectionStart: number; selectionEnd: number } {
  const s = Math.min(start, end);
  const e = Math.max(start, end);
  const selected = value.slice(s, e);
  if (selected.length === 0) {
    const insertion = open + close;
    const newValue = value.slice(0, s) + insertion + value.slice(e);
    const cursor = s + open.length;
    return { newValue, selectionStart: cursor, selectionEnd: cursor };
  }
  const newValue = value.slice(0, s) + open + selected + close + value.slice(e);
  const newStart = s + open.length;
  const newEnd = newStart + selected.length;
  return { newValue, selectionStart: newStart, selectionEnd: newEnd };
}

function startOfLine(value: string, pos: number): number {
  return value.lastIndexOf("\n", Math.max(0, pos - 1)) + 1;
}

function endOfLine(value: string, pos: number): number {
  const nl = value.indexOf("\n", pos);
  return nl === -1 ? value.length : nl;
}

function lineHasBullet(line: string): boolean {
  return /^\s*[-*•]\s+/.test(line);
}

function stripBulletPrefix(rest: string): string {
  return rest.replace(/^[-*•]\s+/, "");
}

type BulletStyle = "dash" | "dot";

function toggleBulletLines(
  value: string,
  start: number,
  end: number,
  style: BulletStyle
): { newValue: string; selectionStart: number; selectionEnd: number } {
  const selStart = Math.min(start, end);
  const selEnd = Math.max(start, end);
  const blockStart = startOfLine(value, selStart);
  const blockEnd = endOfLine(value, selEnd);
  const block = value.slice(blockStart, blockEnd);
  const prefix = style === "dash" ? "- " : "• ";

  // Empty line with caret: insert chosen bullet prefix
  if (block === "" && selStart === selEnd) {
    const newValue = value.slice(0, selStart) + prefix + value.slice(selEnd);
    const cursor = selStart + prefix.length;
    return { newValue, selectionStart: cursor, selectionEnd: cursor };
  }

  const lines = block.split("\n");
  const allBulleted =
    lines.length > 0 &&
    lines.every((line) => !line.trim() || lineHasBullet(line));
  const newLines = lines.map((line) => {
    if (!line.trim()) return line;
    const m = line.match(/^(\s*)(.*)$/);
    if (!m) return line;
    const [, indent, rest0] = m;
    const rest = stripBulletPrefix(rest0);
    if (allBulleted) {
      return indent + rest;
    }
    return indent + prefix + rest;
  });
  const newBlock = newLines.join("\n");
  const newValue = value.slice(0, blockStart) + newBlock + value.slice(blockEnd);
  return {
    newValue,
    selectionStart: blockStart,
    selectionEnd: blockStart + newBlock.length,
  };
}

export default function DescriptionEditor({
  value,
  onChange,
  placeholder,
  rows = 5,
  maxLength,
  required,
  id,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const applyAndFocus = (
    fn: (
      v: string,
      a: number,
      b: number
    ) => { newValue: string; selectionStart: number; selectionEnd: number }
  ) => {
    const el = taRef.current;
    if (!el) return;
    const { newValue, selectionStart, selectionEnd } = fn(value, el.selectionStart, el.selectionEnd);
    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const toolbarBtn =
    "inline-flex items-center justify-center w-8 h-8 rounded-sm border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-40";

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-1 rounded-sm border border-gray-300 bg-gray-50 px-1 py-1">
        <button
          type="button"
          className={toolbarBtn}
          title="Gras (**texte**)"
          aria-label="Gras"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyAndFocus((v, a, b) => applyWrap(v, a, b, "**", "**"))}
        >
          <BsTypeBold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          title="Italique (*texte*)"
          aria-label="Italique"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyAndFocus((v, a, b) => applyWrap(v, a, b, "*", "*"))}
        >
          <BsTypeItalic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          title="Souligné (<u>texte</u>)"
          aria-label="Souligné"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyAndFocus((v, a, b) => applyWrap(v, a, b, "<u>", "</u>"))}
        >
          <BsTypeUnderline className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`${toolbarBtn} min-w-[4.75rem] px-2 gap-1`}
          title="Liste à tirets (- )"
          aria-label="Liste à tirets"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyAndFocus((v, a, b) => toggleBulletLines(v, a, b, "dash"))}
        >
          <BsListUl className="w-4 h-4 shrink-0" />
          <span className="text-xs font-medium">Tiret</span>
        </button>
        <button
          type="button"
          className={`${toolbarBtn} min-w-[4.75rem] px-2 gap-1`}
          title="Liste à puces (• )"
          aria-label="Liste à puces"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyAndFocus((v, a, b) => toggleBulletLines(v, a, b, "dot"))}
        >
          <BsCircleFill className="w-2.5 h-2.5 shrink-0 text-gray-700" />
          <span className="text-xs font-medium">Puce</span>
        </button>
        <span className="text-xs text-gray-500 ml-1 hidden sm:inline">
          Sélectionnez du texte ou placez le curseur, puis utilisez les boutons.
        </span>
      </div>
      <textarea
        ref={taRef}
        id={id}
        className="border border-gray-300 p-2 w-full rounded-sm outline-none focus:border-gray-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
      />
    </div>
  );
}
