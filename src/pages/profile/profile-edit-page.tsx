import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MemberCard, MemberField, memberButton, memberLink } from "../../components/member-form";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import type { MemberInfo } from "../../api/members/me";
import { getRequestError } from "../../api/response";
import { isValidNickname } from "../../utils/member-validation";

export function ProfileEditPage() {
  const { data } = useMeQuery();
  return data ? <ProfileEditForm key={data.email} member={data} /> : null;
}
function ProfileEditForm({ member }: { member: MemberInfo }) {
  const [draft, setDraft] = useState(member.nickname);
  const mutation = useUpdateMeMutation();
  const navigate = useNavigate();
  const canSave = isValidNickname(draft) && draft.trim() !== member.nickname;
  return <MemberCard title="내 정보 수정">
    <form noValidate onSubmit={(event) => {
      event.preventDefault();
      if (!canSave || mutation.isPending) return;
      mutation.mutate({ nickname: draft.trim() }, { onSuccess: () => void navigate({ to: "/profile" }) });
    }}>
      <fieldset className="grid gap-4" disabled={mutation.isPending}>
        <MemberField id="email" label="이메일" type="email" value={member.email} readOnly />
        <MemberField id="nickname" label="닉네임" value={draft} autoComplete="nickname"
          error={!isValidNickname(draft) ? "닉네임은 2~12자로 입력해 주세요." : undefined}
          onChange={(event) => { setDraft(event.target.value); mutation.reset(); }} />
        <button className={memberButton} disabled={!canSave}>{mutation.isPending ? "저장 중" : "저장하기"}</button>
        {mutation.isError && <p role="alert" className="text-sm text-red-600">{getRequestError(mutation.error)}</p>}
        <Link className={`text-center ${memberLink}`} to="/profile">취소</Link>
      </fieldset>
    </form>
  </MemberCard>;
}
