import React from "react";
import { Suspense } from "react";
import GetWork from "@/components/GetWork";

export default function Post() {
  return (
    <Suspense fallback={<h1>Loading get</h1>}>
      <GetWork />
    </Suspense>
  );
}
