import { Link } from "@tanstack/react-router";
import { MemberCard, memberLink } from "../../components/member-form";
import { useMeQuery } from "../../hooks/use-me-query";
import { ProfileFavorites } from "../../components/profile-favorites";

export function ProfilePage() {
  const { data: me } = useMeQuery();
  if (!me) return null;
  return <MemberCard title="마이페이지">
    <dl className="mb-6 grid gap-4">
      <div><dt className="text-sm text-muted">이메일</dt><dd className="break-all font-bold">{me.email}</dd></div>
      <div><dt className="text-sm text-muted">닉네임</dt><dd className="font-bold">{me.nickname}</dd></div>
      <div><dt className="text-sm text-muted">가입일</dt><dd>{me.createdAt.slice(0, 10)}</dd></div>
    </dl>
    <Link className={memberLink} to="/profile/edit">내 정보 수정</Link>
    <ProfileFavorites />
  </MemberCard>;
}
