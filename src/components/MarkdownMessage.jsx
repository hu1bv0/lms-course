import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Component để render message với hỗ trợ LaTeX math
 * Hỗ trợ:
 * - Inline math: $...$  hoặc \(...\)
 * - Block math: $$...$$ hoặc \[...\]
 * - Code blocks: ```...```
 * - Bold: **text**
 * - Italic: *text*
 */
const MarkdownMessage = ({ content }) => {
  const renderContent = (text) => {
    const parts = [];
    let lastIndex = 0;
    
    // Regex patterns
    const blockMathRegex = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g;
    const inlineMathRegex = /\$([^\$\n]+?)\$|\\\((.*?)\\\)/g;
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    
    // First, extract block math và code blocks để tránh conflict
    const preservedBlocks = [];
    let workingText = text;
    
    // Preserve block math
    workingText = workingText.replace(blockMathRegex, (match, content1, content2) => {
      const content = content1 || content2;
      const placeholder = `___BLOCKMATH_${preservedBlocks.length}___`;
      preservedBlocks.push({ type: 'blockmath', content: content.trim() });
      return placeholder;
    });
    
    // Preserve code blocks
    workingText = workingText.replace(codeBlockRegex, (match, code) => {
      const placeholder = `___CODEBLOCK_${preservedBlocks.length}___`;
      preservedBlocks.push({ type: 'code', content: code.trim() });
      return placeholder;
    });
    
    // Split by lines để process
    const lines = workingText.split('\n');
    
    return lines.map((line, lineIndex) => {
      const elements = [];
      let remaining = line;
      let key = 0;
      
      // Check for placeholders
      const placeholderRegex = /___(?:BLOCKMATH|CODEBLOCK)_(\d+)___/g;
      let match;
      
      while ((match = placeholderRegex.exec(remaining)) !== null) {
        const index = match.index;
        const blockIndex = parseInt(match[1]);
        const block = preservedBlocks[blockIndex];
        
        // Add text before placeholder
        if (index > 0) {
          const before = remaining.substring(0, index);
          elements.push(...processInlineElements(before, `${lineIndex}-${key++}`));
        }
        
        // Add block element
        if (block.type === 'blockmath') {
          elements.push(
            <div key={`${lineIndex}-block-${key++}`} className="my-4 overflow-x-auto">
              <BlockMath math={block.content} />
            </div>
          );
        } else if (block.type === 'code') {
          elements.push(
            <pre key={`${lineIndex}-code-${key++}`} className="bg-gray-100 p-3 rounded my-2 overflow-x-auto">
              <code>{block.content}</code>
            </pre>
          );
        }
        
        remaining = remaining.substring(index + match[0].length);
      }
      
      // Process remaining text with inline elements
      if (remaining) {
        elements.push(...processInlineElements(remaining, `${lineIndex}-${key++}`));
      }
      
      return (
        <div key={lineIndex} className={lineIndex < lines.length - 1 ? 'mb-2' : ''}>
          {elements.length > 0 ? elements : <br />}
        </div>
      );
    });
  };
  
  const processInlineElements = (text, baseKey) => {
    const elements = [];
    let remaining = text;
    let key = 0;
    
    // Process inline math
    const inlineMathRegex = /\$([^\$\n]+?)\$|\\\((.*?)\\\)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = inlineMathRegex.exec(text)) !== null) {
      const mathContent = match[1] || match[2];
      const index = match.index;
      
      // Add text before math
      if (index > lastIndex) {
        const before = text.substring(lastIndex, index);
        elements.push(...processTextFormatting(before, `${baseKey}-${key++}`));
      }
      
      // Add inline math
      try {
        elements.push(
          <span key={`${baseKey}-math-${key++}`} className="inline-block mx-1">
            <InlineMath math={mathContent.trim()} />
          </span>
        );
      } catch (error) {
        // Fallback nếu LaTeX invalid
        elements.push(
          <span key={`${baseKey}-math-${key++}`} className="text-red-600 font-mono">
            ${mathContent}$
          </span>
        );
      }
      
      lastIndex = index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex);
      elements.push(...processTextFormatting(remaining, `${baseKey}-${key++}`));
    }
    
    // If no math was found, process the whole text for formatting
    if (elements.length === 0) {
      return processTextFormatting(text, baseKey);
    }
    
    return elements;
  };
  
  const processTextFormatting = (text, baseKey) => {
    const elements = [];
    
    // Process bold and italic
    const formatRegex = /(\*\*.*?\*\*|\*.*?\*)/g;
    const parts = text.split(formatRegex);
    
    parts.forEach((part, index) => {
      if (!part) return;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold
        elements.push(
          <strong key={`${baseKey}-bold-${index}`}>
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic
        elements.push(
          <em key={`${baseKey}-italic-${index}`}>
            {part.slice(1, -1)}
          </em>
        );
      } else {
        // Plain text
        elements.push(
          <span key={`${baseKey}-text-${index}`}>
            {part}
          </span>
        );
      }
    });
    
    return elements.length > 0 ? elements : [text];
  };
  
  return (
    <div className="markdown-content">
      {renderContent(content)}
    </div>
  );
};

export default MarkdownMessage;

