import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MemberCard, MemberField, memberButton, memberLink } from "../../components/member-form";
import { isValidEmail } from "../../utils/member-validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(false);
  const canSubmit = isValidEmail(email) && password.length > 0;

  return (
    <MemberCard title="로그인">
      <form className="grid gap-4" noValidate onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) setPreview(true);
      }}>
        <MemberField id="email" label="이메일" type="email" autoComplete="username" value={email}
          error={email && !isValidEmail(email) ? "이메일 형식을 확인해 주세요." : undefined}
          onChange={(event) => { setEmail(event.target.value); setPreview(false); }} />
        <MemberField id="password" label="비밀번호" type="password" autoComplete="current-password"
          value={password} onChange={(event) => { setPassword(event.target.value); setPreview(false); }} />
        <button className={memberButton} disabled={!canSubmit}>로그인</button>
        {preview && <p role="status" className="text-sm">입력값을 확인했어요. 로그인 API는 8주차에 연결해요.</p>}
      </form>
      <p className="mt-6 text-center text-sm">계정이 없으신가요? <Link className={memberLink} to="/signup">회원가입</Link></p>
    </MemberCard>
  );
}
