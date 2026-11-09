export function withBase(base: string, path = ""): string {
  const joined = [base, path].map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
  return joined ? "/" + joined + (path.includes(".") ? "" : "/") : "/";
}
