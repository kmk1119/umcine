import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MemberCard, MemberField, memberButton, memberLink } from "../../components/member-form";
import { isValidEmail } from "../../utils/member-validation";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getRequestError } from "../../api/response";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useLoginMutation();
  const canSubmit = isValidEmail(email) && password.length > 0;
  return (
    <MemberCard title="로그인">
      <form noValidate onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit || mutation.isPending) return;
        mutation.mutate({ email: email.trim(), password });
      }}>
        <fieldset className="grid gap-4" disabled={mutation.isPending}>
          <MemberField id="email" label="이메일" type="email" autoComplete="username" value={email}
            error={email && !isValidEmail(email) ? "이메일 형식을 확인해 주세요." : undefined}
            onChange={(event) => { setEmail(event.target.value); mutation.reset(); }} />
          <MemberField id="password" label="비밀번호" type="password" autoComplete="current-password"
            value={password} onChange={(event) => { setPassword(event.target.value); mutation.reset(); }} />
          <button className={memberButton} disabled={!canSubmit}>{mutation.isPending ? "로그인 중" : "로그인"}</button>
          {mutation.isError && <p role="alert" className="text-sm text-red-600">{getRequestError(mutation.error)}</p>}
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm">계정이 없으신가요? <Link className={memberLink} to="/signup">회원가입</Link></p>
    </MemberCard>
  );
}
