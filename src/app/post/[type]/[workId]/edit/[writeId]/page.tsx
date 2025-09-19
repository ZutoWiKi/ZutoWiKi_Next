"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import EasyMDE from "easymde";
import { marked, Tokens } from "marked";
import "easymde/dist/easymde.min.css";
import "github-markdown-css/github-markdown.css";
import { UpdateWrite, UpdateWriteData } from "@/components/API/UpdateWrite";
import { GetWritesList } from "@/components/API/GetWriteList";

const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

interface Write {
  id: number;
  title: string;
  user_name: string;
  user_id?: number;
  content: string;
  work_title: string;
  work_author: string;
  created_at: string;
  views: number;
  likes: number;
  parentID: number;
  is_liked?: boolean;
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

export default function EditPage() {
  const params = useParams();
  const writeId = params.writeId as string;
  const workId = params.workId as string;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [writeLoading, setWriteLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<EasyMDE>(null);
  const router = useRouter();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다.");
          router.push("/");
          return;
        }

        const response = await fetch("/api_/mypage/", {
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
        router.push("/");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  // 기존 글 데이터 가져오기
  useEffect(() => {
    const fetchWriteData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const writes = await GetWritesList(workId, token);
        const currentWrite = writes.find((w: Write) => w.id.toString() === writeId);
        
        if (!currentWrite) {
          setError("글을 찾을 수 없습니다.");
          return;
        }

        // 권한 체크 - 작성자만 수정 가능
        if (user && currentWrite.user_id !== user.id) {
          setError("자신이 작성한 글만 수정할 수 있습니다.");
          router.back();
          return;
        }

        setTitle(currentWrite.title);
        setContent(currentWrite.content);
      } catch (error) {
        console.error("글 데이터 로딩 실패:", error);
        setError("글 데이터를 불러오는데 실패했습니다.");
      } finally {
        setWriteLoading(false);
      }
    };

    if (user && !userLoading) {
      fetchWriteData();
    }
  }, [writeId, workId, user, userLoading, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    if (!file.type.startsWith("image/")) {
      alert("사진 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      const res = await fetch("/api/post/upload/", {
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
      placeholder: "수정할 내용을 입력하세요...",
      uploadImage: true,
      imageUploadFunction: (file, onSuccess, onError) => {
        const formData = new FormData();
        formData.append("file", file);
        fetch("/api/post/upload/", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("업로드된 이미지 URL:", data.url);
            onSuccess(data.url);
          })
          .catch(() => onError("업로드 실패"));
      },
      inputStyle: "textarea",
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
                const embed = `<div class="youtube-embed-wrapper"><iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe></div>`;
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

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    if (!user) {
      setError("사용자 정보를 확인할 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      const updateData: UpdateWriteData = {
        title: title.trim(),
        content: content.trim(),
      };

      await UpdateWrite(parseInt(writeId), updateData, token);
      router.back();
    } catch (error) {
      console.error("글 수정 실패:", error);
      setError(
        error instanceof Error ? error.message : "글 수정에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || writeLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </main>
    );
  }

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">글 수정</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 돌아가기
          </button>
        </div>

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
            onClick={handleUpdate}
            disabled={!title.trim() || !content.trim() || isLoading}
            className={`px-6 py-3 font-medium rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isLoading
                ? "bg-gray-400 text-white cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isLoading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </div>
    </main>
  );
}