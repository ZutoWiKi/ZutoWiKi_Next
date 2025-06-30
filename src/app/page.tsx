import { Suspense } from "react";
import GetHello from "@/components/get";
import UserForm from "@/components/userform";
export default async function MyAPP() {
  return (
    <div>
      <Suspense fallback={<h1>Loading get</h1>}>
        <GetHello />
      </Suspense>
      <div>
        <UserForm />
      </div>
    </div>
  );
}
