/** Small two-tone chip used for skills (v3 style). */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex overflow-hidden rounded border border-slate-600 bg-slate-800 text-xs font-medium text-slate-200">
      <span className="bg-slate-700/50 px-2 py-0.5">{children}</span>
    </span>
  );
}
