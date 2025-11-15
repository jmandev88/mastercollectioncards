"use client";

import { useState, useEffect, useRef } from "react";
import CardItem from "./CardItem";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function CardBrowser({
  initialCards,
  initialSet,
  userId = 1,
  allSets,
}) {
  const [cards, setCards] = useState(initialCards);
  const [currentSet, setCurrentSet] = useState(initialSet);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionCount, setCollectionCount] = useState([]);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false); // 👈 NEW
  const dropdownRef = useRef(null);
  const router = useRouter();
  const params = useSearchParams();

  // d

  const sets = allSets;

  const handleSetChange = async (setName) => {
    setOpen(false);
    setCurrentSet(setName);
    setLoading(true);
    router.push(`?set=${setName}`);

    try {
      const cardRes = await fetch(
        `/api/frontend/getcards/${setName}/?name=${setName}`
      );
      const cardData = await cardRes.json();
      setCards(cardData.data || []);

      const collectionRes = await fetch(
        `/api/frontend/getcollections/${setName}?userid=${userId}&name=${setName}`
      );
      const collectionData = await collectionRes.json();
      if (collectionData.data) {
        setCollectionCount(JSON.parse(collectionData.data.meta_value) || []);
      } else {
        setCollectionCount([]);
      }
    } catch (err) {
      console.error("Failed to fetch cards or collection:", err);
      setCards([]);
      setCollectionCount([]);
    } finally {
      setLoading(false);
    }
  };

  const currentLabel =
    sets.find((s) => s.set_id === currentSet)?.details.name || "Select Set";

  // Load initial collection count
  useEffect(() => {
    if (currentSet) {
      (async () => {
        try {
          const res = await fetch(
            `/api/frontend/getcollections/name/${currentSet}?userid=${userId}&name=${currentSet}`
          );
          const data = await res.json();
          if (data.data) {
            setCollectionCount(JSON.parse(data.data.meta_value) || []);
          } else {
            setCollectionCount([]);
          }
        } catch (err) {
          console.error("Failed to fetch initial collection count:", err);
        }
      })();
    }
  }, [currentSet, userId]);

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

  function handleCollectionChange(cardId, action) {
    setCollectionCount((prev) => {
      const updated = [...prev];
      if (action === "add" && !updated.includes(cardId)) updated.push(cardId);
      if (action === "remove") return updated.filter((id) => id !== cardId);
      return updated;
    });
  }

  // 👇 Filter cards based on checkbox
  const visibleCards = showOnlyMissing
    ? cards.filter((c) => !collectionCount.includes(c.id))
    : cards;

  return (
    <div className="w-4/5 h-[calc(100vh-7em)] overflow-scroll">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white flex border-b border-gray-300 shadow-md py-2 px-8 justify-between items-center">
        {/* Dropdown */}
        <div ref={dropdownRef} className="relative flex gap-8">
          <div>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
            >
              <span className="text-gray-800">{currentLabel}</span>
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

            {open && (
              <div className="absolute left-0 mt-2 w-46 bg-white border border-gray-200 rounded-md shadow-lg z-20 h-120 overflow-auto">
                {sets.map((set) => {
                  const isActive = currentSet === set.set_id;
                  return (
                    <button
                      key={set.set_id}
                      onClick={() => handleSetChange(set.set_id)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-brand-red-warm hover:text-white ${
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      <span>{set.details.name}</span>
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

          {/* 👇 Checkbox */}
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyMissing}
              onChange={(e) => setShowOnlyMissing(e.target.checked)}
              className="accent-brand-red-warm"
            />
            Show only missing
          </label>
        </div>
        {/* Count + Checkbox */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div>
            <span className="inline-block mr-1">
              {loading ? "..." : collectionCount.length}
            </span>
            /
            <span className="inline-block ml-1">{`${cards.length} cards`}</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5">
        {loading ? (
          <div className="col-span-5 text-center py-10 text-gray-500">
            Loading...
          </div>
        ) : visibleCards.length > 0 ? (
          visibleCards.map((card) => (
            <CardItem
              active={collectionCount}
              key={card.details.id}
              details={card.details}
              card_id={card.id}
              set_id={card.set_id}
              onCollectionChange={handleCollectionChange}
            />
          ))
        ) : (
          <div className="col-span-5 text-center py-10 text-gray-400 text-sm">
            {showOnlyMissing
              ? "🎉 You have all cards in this set!"
              : "No cards found."}
          </div>
        )}
      </div>
    </div>
  );
}
