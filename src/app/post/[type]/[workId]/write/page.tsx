"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleCancel = () => {
    setTitle("");
    setContent("");
    // TODO: navigate back or clear form
  };

  const handlePublish = () => {
    // TODO: 유효성 검사를 거쳐 API 호출
    console.log("발행할 글:", { title, content });
  };

  return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* 글 제목 입력 */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all"
            />
          </div>

          {/* 글 내용 입력 */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder="내용을 작성하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all resize-none"
            />
          </div>

          {/* 액션 버튼 */}
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
              className={`px-6 py-3 font-medium rounded-lg transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white`}
            >
              글 발행
            </button>
          </div>
        </div>
      </main>
  );
}
