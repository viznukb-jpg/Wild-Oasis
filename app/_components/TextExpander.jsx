"use client";

import { useState } from "react";

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const slicedTextLength = 40;
  const slicedText = children.split(" ").slice(0, slicedTextLength);

  const displayText = isExpanded ? children : slicedText.join(" ") + "...";

  return (
    <span>
      {displayText}{" "}
      {slicedText.length >= slicedTextLength && (
        <button
          className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </span>
  );
}

export default TextExpander;
