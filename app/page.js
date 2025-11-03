import Image from "next/image";
import Link from "next/link";
import CardBrowser from "./components/CardBrowser";

async function getCards(setName = "me1") {
  const res = await fetch(
    `http://localhost:3000/api/frontend/getset/${setName}/?name=${setName}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data || [];
}

export default async function Home() {
  const initialSet = "me1";
  const cards = await getCards(initialSet);

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-300 h-28 px-8 flex items-center">
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
              className="block px-8 py-4 bg-brand-red-warm text-white border-b border-white"
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

        {/* Cards Browser */}
        <CardBrowser initialCards={cards} initialSet={initialSet} />
      </main>
    </>
  );
}
