import { createUser } from "./post";

export default function UserForm() {
  return (
    <form action={createUser}>
      <div>
        <label>
          이름:
          <input type="text" name="name" required />
        </label>
      </div>
      <div>
        <label>
          이메일:
          <input type="email" name="email" required />
        </label>
      </div>
      <button type="submit">사용자 생성</button>
    </form>
  );
}
