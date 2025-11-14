import Image from "next/image";

export default async function Header() {
  return (
    <div className="border-b border-gray-300 h-28 px-8 flex items-center">
      <Image
        src="/logo.svg"
        alt="Master Collection Cards Logo"
        width={200}
        height={200}
      />
    </div>
  );
}
