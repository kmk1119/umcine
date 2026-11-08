import { Link } from "@tanstack/react-router";
import { MemberCard, memberLink } from "../../components/member-form";
import { useProfilePreview } from "../../stores/profile-preview-store";

export function ProfilePage() {
  const { email, nickname } = useProfilePreview();
  return (
    <MemberCard title="내 정보">
      <p className="mb-4 text-sm text-muted">화면 확인용 예시 정보예요.</p>
      <dl className="mb-6 grid gap-4">
        <div><dt className="text-sm text-muted">이메일</dt><dd className="break-all font-bold">{email}</dd></div>
        <div><dt className="text-sm text-muted">닉네임</dt><dd className="font-bold">{nickname}</dd></div>
      </dl>
      <Link className={memberLink} to="/profile/edit">내 정보 수정</Link>
    </MemberCard>
  );
}
