// app/CardItem.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useExtractColors } from "react-extract-colors";

export default function CardItem({ details }) {
  const { dominantColor, lighterColor, darkerColor } = useExtractColors(
    details.images?.small
  );

  const hoverBg = lighterColor || "rgba(0,0,0,0.05)";
  const hoverBorder = darkerColor || "#ccc";

  return (
    <Link
      href="#"
      style={{
        "--hover-bg": hoverBg,
        "--hover-border": hoverBorder,
      }}
      className={`relative border border-gray-300 p-8 border-l-transparent border-t-transparent flex items-center justify-center 
                             transition-all duration-200 ease-out hover:[background-color:var(--hover-bg)] hover:[border-color:var(--hover-border)]`}
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
