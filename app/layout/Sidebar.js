import Link from "next/link";

export default async function Sidebar() {
  return (
    <div className="w-1/5 h-[calc(100vh-7em)] border-r border-gray-300">
      <nav>
        <Link
          href="/"
          className="block px-8 py-4 bg-brand-red-warm text-white border-b border-white"
        >
          Recommended Cards
        </Link>
        <Link
          href="/sets"
          className="relative block px-8 py-4 border-b border-gray-300 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-brand-red-warm origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
          <span className="relative z-10 text-black group-hover:text-white">
            Sets
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
  );
}
