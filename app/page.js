"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useExtractColors } from "react-extract-colors";

// 🔹 Child component — safe to call hook here
function CardItem({ details }) {
  const { dominantColor, lighterColor, darkerColor } = useExtractColors(
    details.images?.small
  );

  const hoverBg = lighterColor || "rgba(0,0,0,0.05)";
  const hoverBorder = darkerColor || "#ccc";

  return (
    <Link
      key={details.images?.small}
      href="#"
      style={{
        "--hover-bg": hoverBg || "rgba(0,0,0,0.05)",
        "--hover-border": hoverBorder || "#000",
      }}
      className="relative border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center 
                             transition-all duration-200 ease-out hover:[background-color:var(--hover-bg)] hover:[border-color:var(--hover-border)]"
    >
      <Image
        src={details.images?.small}
        alt={details.name}
        className="object-contain"
        width={150}
        height={200}
      />
      <Image
        src={details.set.images?.logo}
        alt="Card Logo"
        className="absolute bottom-2 left-2 h-8 object-contain"
        width={150}
        height={200}
      />
    </Link>
  );
}

export default function Home() {
  const pathname = usePathname();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`/api/frontend/getset/base1/?name=base1`);
        const data = await res.json();
        console.log(data, "dd");
        setCards(data.data || []);
      } catch (err) {
        console.error("Failed to load cards", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading cards...</div>;
  }

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
        <div className="w-1/5 h-[calc(100vh-7em)] border-r border-gray-300">
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
        <div className="w-4/5 h-[calc(100vh-7em)] overflow-scroll">
          <div className="grid grid-cols-5">
            {cards.map((card) => (
              <CardItem key={card.details.id} details={card.details} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
