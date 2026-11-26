import Link from "next/link";

export default function MovieNotFound() {
  return (
    <main className="px-5 py-16 text-center">
      <p className="font-bold">영화를 찾을 수 없어요.</p>
      <Link href="/" className="mt-4 inline-block font-bold text-primary">영화 목록으로</Link>
    </main>
  );
}
