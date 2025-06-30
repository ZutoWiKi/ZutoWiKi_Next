"use client";
import { useFormStatus } from "react-dom";
import { createUser } from "./post";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "생성 중..." : "사용자 생성"}
    </button>
  );
}

export default function UserForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createUser}>
      <div>
        <label>
          이름:
          <input type="text" name="name" required disabled={pending} />
        </label>
      </div>
      <div>
        <label>
          이메일:
          <input type="email" name="email" required disabled={pending} />
        </label>
      </div>
      <SubmitButton />
    </form>
  );
}
