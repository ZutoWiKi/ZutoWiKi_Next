"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import EasyMDE from "easymde";
import { marked, Tokens } from "marked";
import "easymde/dist/easymde.min.css";
import "github-markdown-css/github-markdown.css";
import { PostWrite } from "@/components/API/PostWrite";

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface UploadResponse {
  url: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

const renderer = new marked.Renderer();

renderer.list = (token: Tokens.List) => {
  const childrenHtml = token.items
    .map((li) => {
      const content = marked.parseInline(li.text);
      return `<li>${content}</li>`;
    })
    .join("");
  if (token.ordered) {
    return `<ol class="list-decimal list-inside pl-5">${childrenHtml}</ol>`;
  } else {
    return `<ul class="list-disc list-inside pl-5">${childrenHtml}</ul>`;
  }
};

interface WritePageProps {
  params: {
    type: string;
    workId: string;
  };
}

export default function WritePage({ params }: WritePageProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<EasyMDE>(null);
  const router = useRouter();

  const [workId, setWorkId] = useState<string>("");
  const [type, setType] = useState<string>("");

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          router.push("/login"); // 로그인 페이지로 리다이렉트
          return;
        }

        const response = await fetch("/api/mypage/", {
          credentials: "include",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("사용자 정보를 가져올 수 없습니다.");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        setError("사용자 정보를 가져오는데 실패했습니다.");
        router.push("/login");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      console.log("전체 params:", resolvedParams); // 디버깅
      console.log(
        "workId 원본:",
        resolvedParams.workId,
        "타입:",
        typeof resolvedParams.workId,
      ); // 디버깅
      setWorkId(resolvedParams.workId);
      setType(resolvedParams.type);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (workId && !workId) {
      alert("작품을 선택해주세요.");
      router.back();
    }
  }, [workId, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/post/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const url = data.url as string;
      const cm = editorRef.current?.codemirror;
      cm?.replaceSelection(`![${file.name}](${url})`);
      setContent(cm?.getValue() || "");
    } catch {
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  const mdeOptions: EasyMDE.Options = useMemo(() => {
    marked.setOptions({ renderer, gfm: true, breaks: true });

    return {
      autofocus: false,
      spellChecker: false,
      placeholder: "내용을 작성하세요...",
      uploadImage: true,
      imageUploadFunction: (file, onSuccess, onError) => {
        const formData = new FormData();
        formData.append("file", file);
        fetch("http://localhost:8000/post/upload/", {
          method: "POST",
          body: formData,
        })
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
        {
          name: "image",
          action: (editor: EasyMDE) => {
            editorRef.current = editor;
            fileInputRef.current?.click();
          },
          className: "fa fa-image",
          title: "Upload Image",
        },
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
      renderingConfig: { codeSyntaxHighlighting: true },
      previewClass: [
        "markdown-body",
        "!bg-white",
        "!text-black",
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

  const handlePublish = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    if (!workId) {
      setError("작품을 선택해주세요.");
      return;
    }

    if (!user) {
      setError("사용자 정보를 확인할 수 없습니다.");
      return;
    }

    // workId 유효성 검사
    const workIdNumber = parseInt(workId);
    console.log("workId 문자열:", workId, "변환된 숫자:", workIdNumber); // 디버깅

    if (isNaN(workIdNumber) || workIdNumber <= 0) {
      setError("유효하지 않은 작품 ID입니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const writeData = {
        title: title.trim(),
        content: content.trim(),
        user: user.id,
        work: workIdNumber,
      };

      console.log("글 작성 데이터:", writeData); // 디버깅용

      const result = await PostWrite(writeData);
      router.back();
    } catch (error) {
      console.error("글 작성 실패:", error); // 디버깅용
      setError(
        error instanceof Error ? error.message : "글 발행에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 로딩 중
  if (userLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">사용자 정보를 확인하는 중...</div>
        </div>
      </main>
    );
  }

  // 사용자 정보가 없는 경우
  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">로그인이 필요합니다.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 제목 입력 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all"
            disabled={isLoading}
          />
        </div>

        {/* 내용 입력 */}
        <div className="bg-white">
          <SimpleMDEEditor
            value={content}
            onChange={(value: string) => setContent(value)}
            options={mdeOptions}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handlePublish}
            disabled={!title.trim() || !content.trim() || isLoading || !user}
            className={`px-6 py-3 font-medium rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isLoading
                ? "bg-gray-400 text-white cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isLoading ? "발행 중..." : "글 발행"}
          </button>
        </div>
      </div>
    </main>
  );
}
