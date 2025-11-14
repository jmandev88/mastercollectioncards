"use client";

import SetItem from "./Setitem";

export default function SetsBrowser({ sets }) {
  return (
    <div className="w-4/5 h-[calc(100vh-7em)] overflow-scroll">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white flex border-b border-gray-300 shadow-md py-2 px-8 justify-between items-center">
        {/* Custom Dropdown */}
        <div className="relative text-sm">Lorem</div>

        {/* Card Count */}
        <div className="text-gray-600 text-sm">{sets.length} Sets</div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5">
        {sets.map((set) => (
          <SetItem key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}
