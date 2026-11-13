import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import { MemberCard, MemberField, memberButton, memberLink } from "../../components/member-form";
import { isValidEmail, isValidNickname, isValidPassword } from "../../utils/member-validation";

const initialForm = { email: "", nickname: "", password: "", passwordConfirm: "" };
const duplicateFields = {
  email: { label: "이메일", type: "email", validate: isValidEmail, check: checkEmailDuplicate, error: "이메일 형식을 확인해 주세요." },
  nickname: { label: "닉네임", type: "text", validate: isValidNickname, check: checkNicknameDuplicate, error: "닉네임은 2~12자로 입력해 주세요." },
} as const;
type DuplicateField = keyof typeof duplicateFields;
type CheckStatus = "idle" | "checking" | "available" | "taken" | "failed";

export function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [checks, setChecks] = useState<Record<DuplicateField, CheckStatus>>({ email: "idle", nickname: "idle" });
  const signupMutation = useSignupMutation();
  const isSubmitting = signupMutation.isPending;
  const passwordValid = isValidPassword(form.password);
  const confirmationValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const canSubmit = isValidEmail(form.email) && isValidNickname(form.nickname) && passwordValid &&
    confirmationValid && checks.email === "available" && checks.nickname === "available" && !isSubmitting;

  function changeField(key: keyof typeof initialForm, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (key === "email" || key === "nickname") {
      setChecks((previous) => ({ ...previous, [key]: "idle" }));
    }
  }

  async function checkDuplicate(key: DuplicateField) {
    const field = duplicateFields[key];
    const value = form[key].trim();
    if (!field.validate(value) || checks[key] === "checking") return;
    setChecks((previous) => ({ ...previous, [key]: "checking" }));
    try {
      const { available } = await field.check(value);
      setChecks((previous) => ({ ...previous, [key]: available ? "available" : "taken" }));
    } catch {
      setChecks((previous) => ({ ...previous, [key]: "failed" }));
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;
    signupMutation.mutate({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
  }

  return (
    <MemberCard title="회원가입">
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="grid gap-4" disabled={isSubmitting}>
          {(["email", "nickname"] as const).map((key) => {
            const field = duplicateFields[key];
            const valid = field.validate(form[key]);
            const status = checks[key];
            return (
              <div key={key} className="grid gap-1">
                <MemberField id={key} label={field.label} type={field.type} autoComplete={key}
                  value={form[key]} disabled={status === "checking"}
                  error={form[key] && !valid ? field.error : undefined}
                  onChange={(event) => changeField(key, event.target.value)}
                  action={<button type="button" className="shrink-0 rounded-lg border border-line px-3 text-sm font-bold disabled:opacity-50"
                    disabled={!valid || status === "checking"} onClick={() => void checkDuplicate(key)}>
                    {status === "checking" ? "확인 중" : "중복 확인"}
                  </button>} />
                <p role="status" className="text-sm">
                  {status === "available" && `사용할 수 있는 ${field.label}이에요.`}
                  {status === "taken" && `이미 사용 중인 ${field.label}이에요.`}
                  {status === "failed" && "중복 확인에 실패했어요. 다시 시도해 주세요."}
                </p>
              </div>
            );
          })}
          <MemberField id="password" label="비밀번호" type="password" autoComplete="new-password"
            value={form.password} onChange={(event) => changeField("password", event.target.value)}
            error={form.password && !passwordValid ? "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해 주세요." : undefined} />
          <MemberField id="password-confirm" label="비밀번호 확인" type="password" autoComplete="new-password"
            value={form.passwordConfirm} onChange={(event) => changeField("passwordConfirm", event.target.value)}
            error={form.passwordConfirm && !confirmationValid ? "비밀번호가 일치하지 않아요." : undefined} />
          <button className={memberButton} disabled={!canSubmit}>{isSubmitting ? "가입 중" : "가입하기"}</button>
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm">이미 계정이 있나요? <Link className={memberLink} to="/login">로그인</Link></p>
    </MemberCard>
  );
}
