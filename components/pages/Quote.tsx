export function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote className="my-4 border-s-4 border-gray-500 bg-gray-800 p-4 text-textDefault">{children}</blockquote>;
}
