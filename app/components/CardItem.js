"use client";
import Image from "next/image";
import Link from "next/link";
import { useExtractColors } from "react-extract-colors";

export default function CardItem({
  active = [],
  details,
  card_id,
  set_id,
  userId = 1,
  onCollectionChange, // optional callback to refresh parent
}) {
  const { lighterColor, darkerColor } = useExtractColors(details.images?.small);
  const hoverBg = lighterColor || "rgba(0,0,0,0.05)";
  const hoverBorder = darkerColor || "#ccc";

  async function updateCollection(action) {
    try {
      const res = await fetch("/api/capture/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: userId,
          setName: set_id,
          cardId: card_id,
          action, // "add" or "remove"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update collection");
      console.log(`✅ ${action} card ${card_id}`, data);

      if (typeof onCollectionChange === "function") {
        onCollectionChange(card_id, action);
      }
    } catch (err) {
      console.error(`❌ Failed to ${action} card:`, err);
    }
  }

  return (
    <Link
      href="#"
      style={{
        "--hover-bg": hoverBg,
        "--hover-border": hoverBorder,
      }}
      className={`group relative border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center 
        transition-all duration-200 ease-out hover:[background-color:var(--hover-bg)] hover:[border-color:var(--hover-border)]`}
    >
      {active.includes(card_id) ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            updateCollection("remove");
          }}
          className="w-1/2 text-xs text-center p-1 absolute top-0 right-0 text-white bg-red-700/80 hover:bg-red-600 transition"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            updateCollection("add");
          }}
          className="w-1/2 text-xs text-center p-1 absolute top-0 right-0 text-white bg-green-700/80 hover:bg-green-600 transition"
        >
          Add
        </button>
      )}
      {details?.images?.small && (
        <Image
          src={details.images.small}
          alt={details.name || "Card"}
          className={`object-contain ${
            active.includes(card_id) ? "" : "grayscale opacity-50"
          }`}
          width={150}
          height={200}
        />
      )}

      {details?.set?.images?.logo && (
        <Image
          src={details.set.images.logo}
          alt="Card Logo"
          className="absolute bottom-2 left-2 h-8 object-contain"
          width={150}
          height={200}
        />
      )}
    </Link>
  );
}
