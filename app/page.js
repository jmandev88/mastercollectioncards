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
                  ? "bg-brand-red-warm text-white border-b ease-out border-white"
                  : ""
              } block px-8 py-4 hover:brand-red-warm hover:text-white`}
            >
              Recommended Cards
            </Link>
            <Link
              href="/collections"
              className="relative block px-8 py-4 border-b border-gray-300 ease-out overflow-hidden group"
            >
              <span className="absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 text-black group-hover:text-white">
                My Collections
              </span>
            </Link>

            <Link
              href="/decks"
              className="relative block px-8 py-4 border-b border-gray-300 overflow-hidden ease-out group"
            >
              <span className="absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
              <span className="relative z-10 text-black group-hover:text-white">
                My Decks
              </span>
            </Link>
          </nav>
        </div>
        <div className="w-4/5 h-[calc(100vh-7em)] min-h-[calc(100vh-7em)] overflow-scroll">
          <div className="grid grid-cols-5">
            <Link
              href="#"
              className="relative hover:bg-blue-200/30 transition-all duration-200 ease-out hover:border-blue-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/1.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-1.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-purple-200/30 transition-all duration-200 ease-out hover:border-purple-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/2.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-2.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-yellow-200/30 transition-all duration-200 ease-out hover:border-yellow-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/3.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-2.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-teal-200/30 transition-all duration-200 ease-out hover:border-teal-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/4.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-3.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-gray-200/30 transition-all duration-200 ease-out hover:border-gray-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/5.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-3.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-gray-200/30 transition-all duration-200 ease-out hover:border-gray-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/6.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-3.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-green-200/30 transition-all duration-200 ease-out hover:border-green-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/7.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-4.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
            <Link
              href="#"
              className="relative hover:bg-gray-200/30 transition-all duration-200 ease-out hover:border-gray-500 border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center"
            >
              <Image
                src="/placeholders/8.png"
                alt="Card Back"
                className="object-contain"
                width={150}
                height={200}
              />
              <Image
                src="/placeholders/logo-1.png"
                alt="Card Front"
                className="absolute bottom-2 left-2 h-8 object-contain object-bottom-left"
                width={150}
                height={200}
              />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
