"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/clientes", label: "Clientes" },
  { href: "/faturas", label: "Faturas" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="topnav-links" aria-label="Principal">
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="topnav-link"
          aria-current={pathname.startsWith(href) ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
