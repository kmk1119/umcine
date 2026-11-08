import type { ComponentProps, ReactNode } from "react";

export const memberButton = "rounded-lg bg-primary px-4 py-3 font-bold text-white disabled:opacity-50";
export const memberLink = "font-bold text-primary hover:underline";

export function MemberCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto my-10 w-[calc(100%-2.5rem)] max-w-md rounded-2xl border border-line bg-white p-6 sm:my-16 sm:p-8">
      <h1 className="mb-6 text-2xl font-extrabold">{title}</h1>
      {children}
    </main>
  );
}

export function MemberField({ label, error, action, ...input }: ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  action?: ReactNode;
}) {
  const errorId = error ? `${input.id}-error` : undefined;
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold" htmlFor={input.id}>{label}</label>
      <div className="flex gap-2">
        <input className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 disabled:bg-canvas"
          {...input} aria-invalid={error ? true : undefined} aria-describedby={errorId} />
        {action}
      </div>
      {error && <p id={errorId} className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
