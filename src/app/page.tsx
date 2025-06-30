import { Suspense } from "react";
import GetHello from "@/components/get";
import PostHello from "@/components/post";
export default async function MyAPP() {
  return (
    <div>
      <Suspense fallback={<h1>Loading get</h1>}>
        <GetHello />
      </Suspense>
      <Suspense fallback={<h1>Loading post</h1>}>
        <PostHello />
      </Suspense>
    </div>
  );
}
