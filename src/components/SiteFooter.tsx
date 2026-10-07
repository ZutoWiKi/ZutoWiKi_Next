import React from "react";
import Link from "next/link";
import { CATEGORY_LIST } from "@/config/categories";
import { NOTICE_LIST_PATH } from "@/lib/notice";
import { categoryPath } from "@/lib/writeLink";
import VersionTag from "./VersionTag";

interface SiteFooterProps {
  /**
   * 배포된 프론트·백엔드 버전을 보여줄지. 보여주면 페이지마다 백엔드에 한 번씩
   * 물어보므로 홈(PageLayout)에서만 켠다.
   */
  showVersion?: boolean;
  /**
   * 오른쪽 아래에 떠 있는 버튼(글쓰기·목록 접기 등)이 있는 페이지면 켠다. 좁은 화면에서는
   * 맨 아래까지 내려도 버튼이 바닥글 링크를 가리므로, 버튼 높이만큼 여백을 더 둔다.
   * 768px 부터는 바닥글이 가운데로 모여 버튼과 겹치지 않는다.
   */
  clearFloatingButtons?: boolean;
}

/**
 * 모든 페이지 아래에 붙는 바닥글.
 *
 * 갈래 목록으로 가는 진짜 링크를 여기 둔다. 예전에는 갈래 목록으로 가는 길이 떠 있는
 * 메뉴(버튼, 자바스크립트가 돈 뒤에야 그려지고 1024px 보다 좁으면 아예 없음)뿐이라,
 * 검색엔진에게는 사이트맵 말고 갈래 목록으로 가는 링크가 하나도 없었다.
 *
 * prefetch 를 끈다. 켜 두면 바닥글이 화면에 들어올 때마다 갈래 목록 9개를 미리 받으면서
 * 백엔드에 작품 목록을 9번 묻는다.
 */
export default function SiteFooter({
  showVersion = false,
  clearFloatingButtons = false,
}: SiteFooterProps) {
  return (
    <footer className="bg-black/15 backdrop-blur-md shadow-lg border-b border-white/20 px-4 sm:px-6 sm:py-7.5">
      <nav
        aria-label="갈래"
        className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-1 pt-4 pb-3 sm:pt-0 text-sm text-gray-700"
      >
        {CATEGORY_LIST.map((category) => (
          <Link
            key={category.type}
            href={categoryPath(category.type)}
            prefetch={false}
            className="hover:text-blue-700 hover:underline"
          >
            {category.name}
          </Link>
        ))}
      </nav>
      {/* 공지는 갈래가 아니므로 따로 둔다. 홈 띠가 내려가도 여기로 찾아올 수 있다. */}
      <nav
        aria-label="안내"
        className="max-w-7xl mx-auto flex justify-center pb-3 text-sm text-gray-700"
      >
        <Link
          href={NOTICE_LIST_PATH}
          prefetch={false}
          className="hover:text-blue-700 hover:underline"
        >
          공지
        </Link>
      </nav>
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Yoonseul
            </p>
            <img
              src="/yoonseul_logo.svg"
              alt="윤슬 로고"
              className="w-6 h-6 sm:w-10 sm:h-10"
            />
          </Link>
          <Link
            href="https://github.com/ZutoWiKi"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src="/github_logo.svg"
              alt="깃허브"
              className="w-6 h-6 px-1 py-1 sm:w-10 sm:h-10"
            />
          </Link>
          <Link
            href="https://www.instagram.com/yoonseul0617/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img
              src="/insta_logo.svg"
              alt="인스타"
              className="w-6 h-6 px-1 py-1 sm:w-10 sm:h-10"
            />
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex justify-center items-center py-1 font-bold">
        <p>developed by&nbsp;</p>
        <a
          href="https://github.com/berryprince30"
          className="flex items-center gap-2 font-bold bg-gradient-to-r from-pink-600 to-pink-400  bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
        >
          berryprince30
        </a>
        <p>,&nbsp;</p>
        <a
          href="https://github.com/LOOPARAM"
          className="flex items-center gap-2 font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-orange-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
        >
          LOOPARAM
        </a>
      </div>

      <div className="max-w-7xl mx-auto flex justify-center items-center pb-2">
        {showVersion && <VersionTag />}
      </div>

      {clearFloatingButtons && (
        <div aria-hidden="true" className="h-32 sm:h-44 md:hidden" />
      )}
    </footer>
  );
}
