"use client";

import React, { useId, useRef, useState } from "react";
import {
  splitTags,
  tagError,
  TAG_MAX_COUNT,
  TAG_MAX_LENGTH,
} from "@/lib/tags";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

/**
 * 글쓰기·수정 화면의 태그 칸.
 *
 * #태그를 치고 스페이스·엔터·쉼표를 누르면 칩으로 확정한다. #은 안 붙여도 되고,
 * "#소설 #반전" 을 붙여넣으면 한 번에 나뉜다. 빈 칸에서 백스페이스를 누르면 마지막 태그를 지운다.
 * 칸을 벗어날 때도 쓰던 태그를 확정한다 — 태그를 치고 바로 "글 발행"을 눌러도 빠지지 않게.
 *
 * 한글은 조합이 끝난 뒤에 확정한다. 조합 중에 누른 엔터로 바로 확정하면 마지막 글자가
 * 칸에 한 번 더 남는다("소설" 칩 옆에 "설").
 */
export default function TagInput({ value, onChange, disabled }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const enterWhileComposing = useRef(false);
  const hintId = useId();

  /** text 를 태그로 확정한다. 넣지 못한 조각은 칸에 남기고 이유를 보여준다. */
  const commit = (text: string) => {
    const next = [...value];
    const rejected: string[] = [];
    let problem = "";

    for (const name of splitTags(text)) {
      if (next.includes(name)) continue;
      const error =
        tagError(name) ??
        (next.length >= TAG_MAX_COUNT
          ? `태그는 ${TAG_MAX_COUNT}개까지 달 수 있어요.`
          : null);
      if (error) {
        problem = problem || error;
        rejected.push(name);
        continue;
      }
      next.push(name);
    }

    if (next.length !== value.length) onChange(next);
    setDraft(rejected.join(" "));
    setMessage(problem);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // 끝에 공백·쉼표가 붙으면(스페이스, 한글 조합 뒤의 띄어쓰기) 그 앞까지를 확정한다.
    if (/[\s,]$/.test(text)) {
      commit(text);
      return;
    }
    setDraft(text);
    if (message) setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) {
        // 한글 조합 중에 누른 엔터. 조합이 끝나면 확정한다(handleCompositionEnd).
        enterWhileComposing.current = true;
        return;
      }
      e.preventDefault();
      commit(draft);
      return;
    }
    if (
      e.key === "Backspace" &&
      !e.nativeEvent.isComposing &&
      draft === "" &&
      value.length > 0
    ) {
      onChange(value.slice(0, -1));
      setMessage("");
    }
  };

  const handleCompositionEnd = () => {
    if (!enterWhileComposing.current) return;
    enterWhileComposing.current = false;
    // 조합이 끝난 글자가 칸에 들어간 뒤에 읽는다.
    setTimeout(() => commit(inputRef.current?.value ?? ""), 0);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    // 여러 개를 한 번에 붙여넣으면 바로 나눈다. 한 단어는 평소처럼 칸에 들어간다.
    if (!/[\s,#]/.test(text)) return;
    e.preventDefault();
    commit(`${draft} ${text}`);
  };

  const handleBlur = () => {
    if (draft.trim()) commit(draft);
  };

  const remove = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex flex-wrap items-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white/90 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all ${
          disabled ? "opacity-60" : "cursor-text"
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              disabled={disabled}
              aria-label={`태그 ${tag} 지우기`}
              className="w-5 h-5 inline-flex items-center justify-center rounded-full text-blue-400 hover:text-blue-700 hover:bg-blue-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionEnd={handleCompositionEnd}
          onPaste={handlePaste}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={
            value.length === 0
              ? "#태그를 입력하고 스페이스나 엔터를 누르세요"
              : ""
          }
          aria-label="태그"
          aria-describedby={hintId}
          autoComplete="off"
          className="flex-1 min-w-[8rem] py-1 bg-transparent outline-none text-gray-800"
        />
      </div>
      <p
        id={hintId}
        aria-live="polite"
        className={`mt-1.5 text-xs ${message ? "text-red-600" : "text-gray-500"}`}
      >
        {message ||
          `태그 ${value.length}/${TAG_MAX_COUNT} · 한글·영문·숫자·밑줄(_)만, 띄어쓰기 없이 ${TAG_MAX_LENGTH}자까지`}
      </p>
    </div>
  );
}
