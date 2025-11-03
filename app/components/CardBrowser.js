"use client";

import { useState, useEffect, useRef } from "react";
import CardItem from "./CardItem";

export default function CardBrowser({ initialCards, initialSet }) {
  const [cards, setCards] = useState(initialCards);
  const [currentSet, setCurrentSet] = useState(initialSet);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sets = [
    { id: "me1", label: "Mega Evolution" },
    { id: "base1", label: "Base Set 1" },
  ];

  const handleSetChange = async (setName) => {
    setOpen(false);
    setCurrentSet(setName);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/frontend/getset/${setName}/?name=${setName}`
      );
      const data = await res.json();
      console.log(data, `/api/frontend/getset/${setName}/?name=${setName}`);
      setCards(data.data || []);
    } catch (err) {
      console.error("Failed to fetch cards for", setName, err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const currentLabel =
    sets.find((s) => s.id === currentSet)?.label || "Select Set";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-4/5 h-[calc(100vh-7em)] overflow-scroll">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white flex border-b border-gray-300 shadow-md py-4 px-8 justify-between items-center">
        {/* Custom Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
          >
            <span className="text-gray-800">{currentLabel}</span>

            {/* ▼ Chevron SVG */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
              {sets.map((set) => {
                const isActive = currentSet === set.id;
                return (
                  <button
                    key={set.id}
                    onClick={() => handleSetChange(set.id)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-brand-red-warm hover:text-white ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    <span>{set.label}</span>

                    {/* ✓ Checkmark SVG */}
                    {isActive && (
                      <svg
                        className="w-4 h-4 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Card Count */}
        <div className="text-gray-600 text-sm">
          {loading ? "Loading..." : `${cards.length} cards`}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5">
        {cards.map((card) => (
          <CardItem key={card.details.id} details={card.details} />
        ))}
      </div>
    </div>
  );
}
