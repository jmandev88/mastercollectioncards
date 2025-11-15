"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isSetsActive = pathname.startsWith("/sets");

  const linkClasses = (active) =>
    active
      ? "relative block px-8 py-4 border-b border-gray-300 bg-brand-red-warm text-white"
      : "relative block px-8 py-4 border-b border-gray-300 overflow-hidden group";

  const hoverBg =
    "absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out";

  const hoverText = "relative z-10 text-black group-hover:text-white";

  return (
    <div className="w-1/5 h-[calc(100vh-7em)] border-r border-gray-300">
      <nav>
        {/* My Collection */}
        <Link
          href="/"
          className={
            pathname === "/"
              ? "block px-8 py-4 bg-brand-red-warm text-white border-b border-white"
              : "block px-8 py-4 text-black border-b border-gray-300 hover:bg-gray-100"
          }
        >
          My Collection
        </Link>

        {/* Sets */}
        <Link href="/sets" className={linkClasses(isSetsActive)}>
          {isSetsActive && (
            <span className="absolute inset-0 bg-brand-red-warm"></span>
          )}
          {!isSetsActive && <span className={hoverBg}></span>}

          <span
            className={isSetsActive ? "relative z-10 text-white" : hoverText}
          >
            Sets
          </span>
        </Link>
      </nav>
    </div>
  );
}
