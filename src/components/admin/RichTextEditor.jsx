import React, { useEffect, useRef } from "react";

const commands = {
  bold: () => document.execCommand("bold"),
  italic: () => document.execCommand("italic"),
  underline: () => document.execCommand("underline"),
  alignLeft: () => document.execCommand("justifyLeft"),
  alignCenter: () => document.execCommand("justifyCenter"),
  alignRight: () => document.execCommand("justifyRight"),
  alignJustify: () => document.execCommand("justifyFull"),
  unorderedList: () => document.execCommand("insertUnorderedList"),
  orderedList: () => document.execCommand("insertOrderedList"),
  undo: () => document.execCommand("undo"),
  redo: () => document.execCommand("redo"),
  link: () => {
    const url = prompt("Enter URL");
    if (url) document.execCommand("createLink", false, url);
  },
  fontName: (name) => document.execCommand("fontName", false, name),
  fontSize: (size) => document.execCommand("fontSize", false, size),
  foreColor: (color) => document.execCommand("foreColor", false, color),
  backColor: (color) => document.execCommand("backColor", false, color),
  removeFormat: () => document.execCommand("removeFormat"),
};

const fonts = ["Sans Serif", "Serif", "Monospace", "Arial", "Georgia", "Tahoma", "Times New Roman"];

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && typeof value === "string") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || "";
    onChange?.(html);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b dark:border-gray-700">
        <button type="button" onClick={commands.undo} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">↶</button>
        <button type="button" onClick={commands.redo} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">↷</button>
        <select onChange={(e) => commands.fontName(e.target.value)} className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white">
          {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={(e) => commands.fontSize(e.target.value)} className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white">
          {[1,2,3,4,5,6,7].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" onClick={commands.bold} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 font-bold">B</button>
        <button type="button" onClick={commands.italic} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 italic">I</button>
        <button type="button" onClick={commands.underline} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 underline">U</button>
        <input aria-label="Text color" type="color" onChange={(e) => commands.foreColor(e.target.value)} className="w-8 h-6" />
        <input aria-label="Background color" type="color" onChange={(e) => commands.backColor(e.target.value)} className="w-8 h-6" />
        <button type="button" onClick={commands.alignLeft} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">L</button>
        <button type="button" onClick={commands.alignCenter} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">C</button>
        <button type="button" onClick={commands.alignRight} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">R</button>
        <button type="button" onClick={commands.alignJustify} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">J</button>
        <button type="button" onClick={commands.unorderedList} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">•</button>
        <button type="button" onClick={commands.orderedList} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">1.</button>
        <button type="button" onClick={commands.link} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Link</button>
        <button type="button" onClick={commands.removeFormat} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Clear</button>
      </div>
      <div
        ref={editorRef}
        onInput={handleInput}
        contentEditable
        className="p-3 min-h-40 outline-none dark:text-white dark:bg-gray-800"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
};

export default RichTextEditor;
