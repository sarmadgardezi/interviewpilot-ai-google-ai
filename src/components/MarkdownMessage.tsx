"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  return (
    <div className={`markdown-content text-xs leading-relaxed space-y-2.5 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-extrabold text-slate-900 mt-3 mb-1.5 pb-1 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-slate-900 mt-2.5 mb-1 text-blue-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-slate-900 mt-2 mb-1 flex items-center gap-1.5 text-blue-800">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-1.5 text-slate-800 leading-relaxed font-normal">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-950 bg-amber-50/60 px-0.5 rounded">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1 my-1.5 text-slate-700">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1 my-1.5 text-slate-700">{children}</ol>
          ),
          li: ({ children }) => <li className="my-0.5 leading-relaxed">{children}</li>,
          hr: () => <hr className="my-3 border-slate-200" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-blue-500 pl-3 py-1 my-2 bg-blue-50/50 rounded-r-lg text-slate-700 italic">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName && !String(children).includes("\n");
            if (isInline) {
              return (
                <code
                  className="bg-slate-200/80 text-blue-900 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, "");
            return <CodeBlock code={codeText} language={codeClassName || ""} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const cleanLang = language.replace(/language-/, "") || "code";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
        <span className="uppercase font-bold tracking-wider">{cleanLang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
