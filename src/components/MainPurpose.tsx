// components/UI/PurposeSection.tsx
"use client";
import React from "react";

export default function PurposeSection() {
  return (
    <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
      {/* 제목 섹션 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          💡 원래 문학은 재밌다!
        </h2>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          🔨 오늘부터라면 왜 안 되겠는가? - [모든 문학 경계의 파괴]!
        </h3>
      </div>
      <hr></hr>
      <p className="text-center px-2 py-2 text-sm sm:text-base text-gray-600 leading-relaxed break-words overflow-hidden">
        🌊&ldquo;윤슬&rdquo;에 오신것을 환영합니다!
        <br />
        윤슬은 햇빛이나 달빛이 바다나 파도에 비치어 반짝이는 잔물결을
        의미합니다.
        <br />
        같은 파도에도 다양하게 빛이 비칠 수 있는 것 처럼,
        <br />
        같은 문학작품에도 정말 다양한 시선이 있을 수 있습니다.
        <br />
        &ldquo;윤슬&rdquo;은 이러한 사실을 널리 알리고자 만들어졌습니다.
        <br />
        어렵게 해석하거나 논문처럼 써도 되지만, 그냥 느낀점이나 🐶소리를 써도
        무방합니다!
        <br />
        아니, 오히려 논리적인 🐶소리를 써주십시오! [장송의 프리렌]을
        [어린왕자]로 분석해주십시오!
        <br />
        <br />
        또한 &ldquo;윤슬&rdquo;은 경계가 없는 파도처럼, 우리는 문학의 경계를
        없애고자 합니다.
        <br />
        게임 언더테일도 카프카의 변신만큼이나 훌륭한 문학 작품이라 할 수
        있습니다.
        <br />
        <br />
        &ldquo;윤슬&rdquo;은 하나의 장으로서 기능할 것입니다.
        <br />
        내 생각을 공유하고 남의 생각을 읽을 수 있는 문학 소통의 장으로서!
        <br />
        오늘부터라면 왜 안 되겠는가? - [모든 문학 경계의 파괴]!
        <br />
      </p>
    </section>
  );
}
