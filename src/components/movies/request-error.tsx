export function RequestError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="py-16 text-center">
    <p className="font-bold">{message}</p>
    <button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-ink px-5 py-3 font-bold text-white">다시 시도</button>
  </div>;
}
