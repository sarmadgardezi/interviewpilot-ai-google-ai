"use client";

import React, { useState, useEffect } from "react";
import { MarkdownMessage } from "./MarkdownMessage";
import { RunningDoodle } from "./RunningDoodle";
import { FastForward } from "lucide-react";

interface TypewriterMessageProps {
  content: string;
  isStreaming?: boolean;
  onComplete?: () => void;
}

export function TypewriterMessage({
  content,
  isStreaming = false,
  onComplete,
}: TypewriterMessageProps) {
  const [displayedText, setDisplayedText] = useState(isStreaming ? "" : content);
  const [isTyping, setIsTyping] = useState(isStreaming);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(content);
      setIsTyping(false);
      return;
    }

    const words = content.split(" ");
    let index = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      index += 2; // Type 2 words at a time for natural fast reading speed
      if (index >= words.length) {
        setDisplayedText(content);
        setIsTyping(false);
        clearInterval(interval);
        onComplete?.();
      } else {
        setDisplayedText(words.slice(0, index).join(" "));
      }
    }, 28);

    return () => clearInterval(interval);
  }, [content, isStreaming]);

  const handleSkip = () => {
    setDisplayedText(content);
    setIsTyping(false);
    onComplete?.();
  };

  return (
    <div className="relative group">
      {isTyping && (
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
          <RunningDoodle state="running" />
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Show full text"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>
      )}

      <MarkdownMessage content={displayedText} />
    </div>
  );
}
