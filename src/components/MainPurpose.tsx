// components/UI/PurposeSection.tsx
"use client";
import React from "react";
import { HiLightBulb } from "react-icons/hi";

export default function PurposeSection() {
  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-4">
        <HiLightBulb className="text-yellow-400 w-6 h-6 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-800">원래 문학은 재밌다!</h2>
      </div>
      <h3 className="text-2xl font-semibold text-gray-800">
        오늘부터라면 왜 안 되겠는가? - [모든 문학 경계의 파괴]!
      </h3>
      <p className="text-gray-600 leading-relaxed h-100">
        이 공간은 여러분이 좋아하는 작품에 대한 감상과 해석을 자유롭게 나누고,  
        서로의 시선을 통해 새로운 인사이트를 얻기 위함입니다.  
        쉽고 직관적인 인터페이스로 글을 쓰고,  
        다른 분들의 글을 읽으며 작품 세계를 더욱 풍부하게 즐겨보세요.
      </p>
    </section>
  );
}
