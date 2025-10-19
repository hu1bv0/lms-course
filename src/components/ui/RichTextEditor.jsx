import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Nhập nội dung..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Handle content change
  const handleContentChange = (e) => {
    onChange(e.target.value);
  };

  // Handle selection change
  const handleSelectionChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  // Format text
  const formatText = (command) => {
    const textarea = document.querySelector('.rich-text-editor textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'list':
        formattedText = `• ${selectedText}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  // Toolbar buttons
  const toolbarButtons = [
    { command: 'bold', icon: Bold, title: 'In đậm (**text**)' },
    { command: 'italic', icon: Italic, title: 'In nghiêng (*text*)' },
    { command: 'underline', icon: Underline, title: 'Gạch chân (__text__)' },
    { separator: true },
    { command: 'list', icon: List, title: 'Danh sách (• item)' },
    { command: 'numbered', icon: ListOrdered, title: 'Danh sách số (1. item)' },
    { command: 'quote', icon: Quote, title: 'Trích dẫn (> text)' },
  ];

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.separator) {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
          }
          
          const Icon = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={() => formatText(button.command)}
              title={button.title}
              className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleContentChange}
          onSelect={handleSelectionChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full min-h-[200px] p-4 border-none focus:outline-none resize-none ${
            isFocused ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            minHeight: '200px',
            lineHeight: '1.6',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      </div>
      
      {/* Help Text */}
      <div className="bg-blue-50 border-t border-gray-200 px-4 py-2">
        <p className="text-xs text-blue-600">
          💡 <strong>Mẹo:</strong> Chọn text và click các nút trên thanh công cụ để format. 
          Sử dụng Markdown: **bold**, *italic*, __underline__, • list, {'>'} quote
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
