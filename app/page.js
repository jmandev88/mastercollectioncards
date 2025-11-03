"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExtractColors } from "react-extract-colors";

export default function Home() {
  const pathname = usePathname();

  // extract colors for each placeholder
  const imgPaths = [
    "/placeholders/1.png",
    "/placeholders/2.png",
    "/placeholders/3.png",
    "/placeholders/4.png",
    "/placeholders/5.png",
    "/placeholders/6.png",
    "/placeholders/7.png",
    "/placeholders/8.png",
  ];

  // run hook for each image (you can memoize or map)
  const colors = imgPaths.map((path) => useExtractColors(path));
  console.log(colors);
  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-300 shadow-md h-28 px-8 flex items-center">
        <Image
          src="/logo.svg"
          alt="Master Collection Cards Logo"
          width={200}
          height={200}
        />
      </div>

      <main className="flex">
        {/* Sidebar */}
        <div className="w-1/5 h-[calc(100vh-7em)] min-h-[calc(100vh-7em)] border-r border-gray-300">
          <nav>
            <Link
              href="/"
              className={`${
                pathname === "/"
                  ? "bg-brand-red-warm text-white border-b border-white"
                  : ""
              } block px-8 py-4 hover:bg-brand-red-warm hover:text-white ease-out`}
            >
              Recommended Cards
            </Link>

            <Link
              href="/collections"
              className="relative block px-8 py-4 border-b border-gray-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 text-black group-hover:text-white">
                My Collections
              </span>
            </Link>

            <Link
              href="/decks"
              className="relative block px-8 py-4 border-b border-gray-300 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 text-black group-hover:text-white">
                My Decks
              </span>
            </Link>
          </nav>
        </div>

        {/* Cards Grid */}
        <div className="w-4/5 h-[calc(100vh-7em)] min-h-[calc(100vh-7em)] overflow-scroll">
          <div className="grid grid-cols-5">
            {imgPaths.map((path, i) => {
              const { dominantColor, lighterColor, darkerColor } = colors[i];
              return (
                <Link
                  key={path}
                  href="#"
                  style={{
                    "--hover-bg": lighterColor || "rgba(0,0,0,0.05)",
                    "--hover-border": lighterColor || "#000",
                  }}
                  className="relative border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center 
                             transition-all duration-200 ease-out hover:[background-color:var(--hover-bg)] hover:[border-color:var(--hover-border)]"
                >
                  <Image
                    src={path}
                    alt={`Card ${i + 1}`}
                    className="object-contain"
                    width={150}
                    height={200}
                  />
                  <Image
                    src={`/placeholders/logo-${(i % 4) + 1}.png`}
                    alt="Card Logo"
                    className="absolute bottom-2 left-2 h-8 object-contain"
                    width={150}
                    height={200}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
