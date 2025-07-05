"use client";
import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface Props {
  src: string;
  alt: string;
  width:number;
  height:number;
  className: string;
  id: number;
  size?: number;               // 원한다면 크기도 prop으로 조절
}

const COLORS = [
  'bg-red-500','bg-orange-500','bg-amber-500','bg-yellow-500',
  'bg-lime-500','bg-green-500','bg-emerald-500','bg-teal-500',
  'bg-cyan-500','bg-sky-500','bg-blue-500','bg-indigo-500',
  'bg-violet-500','bg-purple-500','bg-fuchsia-500','bg-pink-500',
  'bg-rose-500',
];

export default function UserProfileColorImage({
  src,
  id,
  size = 64,
}: Props) {
  const idx = id % COLORS.length;
  const colorClass = COLORS[idx];

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-full',
        colorClass
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="avatar"
        fill
        className="object-cover mix-blend-multiply"
      />
    </div>
  );
}