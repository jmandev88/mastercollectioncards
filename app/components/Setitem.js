"use client";
import Image from "next/image";
import Link from "next/link";
import { useExtractColors } from "react-extract-colors";

export default function SetItem({ set }) {
  const { lighterColor, darkerColor } = useExtractColors(
    set.details.images.logo
  );
  const hoverBg = lighterColor || "rgba(0,0,0,0.05)";
  const hoverBorder = darkerColor || "#ccc";

  return (
    <Link
      href={`/sets/${set.details.id}`}
      style={{
        "--hover-bg": hoverBg,
        "--hover-border": hoverBorder,
      }}
      className={`group relative border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center 
        transition-all duration-200 ease-out hover:[background-color:var(--hover-bg)] hover:[border-color:var(--hover-border)]`}
    >
      {set
        ? set.details.images.logo && (
            <Image
              src={set.details.images.logo}
              alt={set.details.name || "Set"}
              className="object-contain"
              width={150}
              height={200}
            />
          )
        : null}
    </Link>
  );
}
