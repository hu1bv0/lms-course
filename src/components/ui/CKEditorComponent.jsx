import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ value, onChange, placeholder = "Nhập nội dung..." }) => {
  const [editorData, setEditorData] = useState(value || '');

  // Update editor data when value prop changes
  useEffect(() => {
    setEditorData(value || '');
  }, [value]);

  // Handle editor change
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data);
  };

  // Custom configuration
  const editorConfiguration = {
    placeholder: placeholder,
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'strikethrough',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'link',
        '|',
        'undo',
        'redo'
      ]
    },
    language: 'vi',
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    }
  };

  return (
    <div className="ckeditor-wrapper border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={editorConfiguration}
        onChange={handleEditorChange}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
          
          // Add custom CSS for underline
          const style = document.createElement('style');
          style.textContent = `
            .ck-editor__editable u {
              text-decoration: underline;
            }
            .ck-editor__editable .underline {
              text-decoration: underline;
            }
          `;
          document.head.appendChild(style);
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            console.log('Editor will restart after the error.');
          }
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
