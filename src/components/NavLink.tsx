// src/components/NavLink.tsx
"use client";

import { useRouter } from "next/navigation";
import { AnchorHTMLAttributes, ReactNode } from "react";
import { resolveHref } from "@/utils/nav";
import { Route } from "next";

type Props = {
  to: string; // "/modes", "/daily", etc.
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function NavLink({ to, children, onClick, ...rest }: Props) {
  const router = useRouter();
  const href = resolveHref(to);

  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault(); // ⬅️ prevent full page load
        router.push(href as Route); // ⬅️ SPA navigation
      }}
    >
      {children}
    </a>
  );
}
