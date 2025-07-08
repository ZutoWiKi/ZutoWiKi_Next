"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import EasyMDE from "easymde";
import { marked, Tokens } from "marked";
import "easymde/dist/easymde.min.css";
import "github-markdown-css/github-markdown.css";

const renderer = new marked.Renderer();

renderer.list = (token: Tokens.List) => {
  // token.items 는 ListItem[] 배열
  const childrenHtml = token.items
    .map((li) => {
      // ListItem.text 는 원본 마크다운 텍스트
      // parseInline 으로 inline 요소만 렌더링
      const content = marked.parseInline(li.text);
      return `<li>${content}</li>`;
    })
    .join("");

  // ordered 여부에 따라 ol / ul 태그 선택
  if (token.ordered) {
    return `<ol class="list-decimal list-inside pl-5">${childrenHtml}</ol>`;
  } else {
    return `<ul class="list-disc list-inside pl-5">${childrenHtml}</ul>`;
  }
};

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const mdeOptions: EasyMDE.Options = useMemo(() => {
    marked.setOptions({ renderer, gfm: true, breaks: true }); //pedantic

    return {
      autofocus: false,
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
        "bold",
        "italic",
        "heading",
        "heading-smaller",
        "heading-bigger",
        "horizontal-rule",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        {
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
        "undo",
        "redo",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "guide",
      ],
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      previewClass: [
        "markdown-body",
        "bg-white",
        "text-black",
        "list-disc",
        "list-decimal",
        "list-inside",
      ],
      previewRender: (plainText: string) => {
        const parsedHtml = marked.parse(plainText) as string;
        return `<div class="markdown-body" style="background-color: white; color: black; padding: 16px;">${parsedHtml}</div>`;
      },
      minHeight: "450px",
    };
  }, []);

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
        <div className="bg-white">
          <SimpleMDEEditor
            value={content}
            onChange={(value: string) => setContent(value)}
            options={mdeOptions}
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
