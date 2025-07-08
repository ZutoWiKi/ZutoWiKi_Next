"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import EasyMDE from "easymde";
import { marked } from "marked";
import "easymde/dist/easymde.min.css";

const SimpleMDEEditor = dynamic(
  () => import("react-simplemde-editor"), 
  { ssr: false }
);

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const getMdeOptions = (): EasyMDE.Options => {

    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    
    return {
    autofocus: true,
    spellChecker: false,
    placeholder: "내용을 작성하세요...",
    uploadImage: true,
    imageUploadFunction: (file, onSuccess, onError) => {
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/upload", { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => onSuccess(data.url))
        .catch(() => onError("업로드 실패"));
    },
    inputStyle: "contenteditable",
    toolbar: [
      "bold", "italic", "heading", "heading-smaller", "heading-bigger","horizontal-rule", "|",
      "quote", "code", "unordered-list", "ordered-list", "table", "|",
      "link", "image", {
        name: "youtube",
        action: function (editor) {
          const url = prompt("YouTube URL을 입력하세요:");
          if (url) {
            const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
            const id = match ? match[1] : null;
            if (id) {
              const embed = `<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/${id}\" frameborder=\"0\" allowfullscreen></iframe>`;
              editor.codemirror.replaceSelection(embed);
            } else {
              alert("유효한 YouTube URL이 아닙니다.");
            }
          }
        },
        className: "fa fa-youtube",
        title: "Insert YouTube Video",
      },
      "|",
      "undo", "redo", "|",
      "preview", "side-by-side", "fullscreen", "guide"
    ],
    renderingConfig: {
      codeSyntaxHighlighting: true,
    },
    previewRender: (plainText: string) => marked.parse(plainText),
    minHeight: '500px',
  }
};

  const handlePublish = () => {
    // TODO: 유효성 검사 및 API 호출
    console.log("발행할 글:", { title, content });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all"
          />
        </div>
        <div>
          <SimpleMDEEditor
            value={content}
            options={getMdeOptions()}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handlePublish}
            disabled={!title || !content}
            className={`px-6 py-3 font-medium rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white`}
          >
            글 발행
          </button>
        </div>
      </div>
    </main>
  );
}
