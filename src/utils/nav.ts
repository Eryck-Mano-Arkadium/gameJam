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
  const href = resolveHref(target);
  if (typeof window !== "undefined" && window.location.protocol === "file:") {
    window.location.href = href;
    return;
  }
  router.push(href as any);
}


