import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MemberCard, MemberField, memberButton, memberLink } from "../../components/member-form";
import { useProfilePreview } from "../../stores/profile-preview-store";
import { isValidNickname } from "../../utils/member-validation";

export function ProfileEditPage() {
  const { email, nickname, setNickname } = useProfilePreview();
  const [draft, setDraft] = useState(nickname);
  const navigate = useNavigate();
  const canSave = isValidNickname(draft) && draft.trim() !== nickname;

  return (
    <MemberCard title="내 정보 수정">
      <form className="grid gap-4" noValidate onSubmit={(event) => {
        event.preventDefault();
        if (!canSave) return;
        setNickname(draft.trim());
        void navigate({ to: "/profile" });
      }}>
        <MemberField id="email" label="이메일" type="email" value={email} readOnly />
        <MemberField id="nickname" label="닉네임" value={draft} autoComplete="nickname"
          error={!isValidNickname(draft) ? "닉네임은 2~12자로 입력해 주세요." : undefined}
          onChange={(event) => setDraft(event.target.value)} />
        <p className="text-sm text-muted">수정한 닉네임은 이 화면을 확인하는 동안에만 적용돼요.</p>
        <button className={memberButton} disabled={!canSave}>저장하기</button>
        <Link className={`text-center ${memberLink}`} to="/profile">취소</Link>
      </form>
    </MemberCard>
  );
}
