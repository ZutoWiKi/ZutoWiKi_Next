import GetWork from "@/components/GetWork";
import React, { Suspense } from "react";

interface PostTypePageProps {
  params: {
    type: string;
  };
}

export default function PostTypePage({ params }: PostTypePageProps) {
  const { type } = params;

  return (
    <div>
      <h1>Post Type: {type}</h1>
      <Suspense fallback={<h1>Loading get</h1>}>
        <GetWork type={type} />
      </Suspense>
    </div>
  );
}
