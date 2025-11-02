"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  return (
    <>
      <div className="border-b border-gray-300 shadow-md h-28 px-8">
        <Image
          src="/logo.svg"
          alt="Master Collection Cards Logo"
          width={200}
          height={200}
        />
      </div>
      <main className="flex">
        <div className="w-1/5 h-[calc(100vh-7em)] min-h-[calc(100vh-7em)] border-r border-gray-300">
          <nav>
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "bg-brand-red text-white"
                  : "hover:bg-brand-red hover:text-white"
              } block px-8 py-6 bg-linear-to-b hover:from-brand-red hover:to-brand-red-warm hover:text-white`}
            >
              Recommended Cards
            </Link>
            <Link
              href="/collections"
              className="block px-8 py-6 border-gray-300 border-b"
            >
              My Collections
            </Link>
            <Link
              href="/decks"
              className="block px-8 py-6 border-gray-300 border-b"
            >
              My Decks
            </Link>
          </nav>
        </div>
        <div className="w-4/5 h-[calc(100vh-7em)] min-h-[calc(100vh-7em)] overflow-scroll">
          <div className="grid grid-cols-5">
            <div className="border border-gray-300 p-8 border-t-0 border-l-0 h-32 flex items-center justify-center">
              Card 1
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
