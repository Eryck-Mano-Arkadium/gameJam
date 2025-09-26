export function resolveHref(target: string): string {
  const normalized = (target || "/").replace(/\s+/g, "");
  const cleanTarget = normalized.replace(/^\//, "").replace(/\/index\.html$/, "");
  if (typeof window === "undefined") {
    const isProd = process.env.NODE_ENV === "production";
    return isProd ? `${cleanTarget}/` : `/${cleanTarget}`;
  }
  const isFile = window.location.protocol === "file:";
  if (!isFile) {
    // http(s) paths (Next dev server or static hosting): use absolute app paths
    return normalized;
  }
  // file:// with <base href> injected at out/ root: use relative to base
  return `${cleanTarget}/`;
}

export function navigate(router: { push: (href: string) => any }, target: string) {
  const hasWindow = typeof window !== "undefined";
  if (hasWindow) {
    const normalized = (target || "/").replace(/\s+/g, "");
    const cleanTarget = normalized.replace(/^\//, "").replace(/\/index\.html$/, "");
    // Always resolve against document.baseURI so subpath deployments work
    const resolved = new URL(`${cleanTarget}/`, document.baseURI).toString();
    window.location.href = resolved;
    return;
  }
  // SSR fallback
  router.push(resolveHref(target) as any);
}


