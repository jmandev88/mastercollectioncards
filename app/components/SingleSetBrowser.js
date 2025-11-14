"use client";

import { useState, useEffect } from "react";
import CardItem from "./CardItem";

export default function SingleSetBrowser({
  setDetails,
  initialCards,
  initialSet,
  userId = 1,
}) {
  const [cards, setCards] = useState(initialCards);
  const [currentSet, setCurrentSet] = useState(initialSet);
  const [currentSetDetails, setCurrentSetDetails] = useState(setDetails);
  const [loading, setLoading] = useState(false);
  const [collectionCount, setCollectionCount] = useState([]);

  // Load initial collection count when component mounts
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

  function handleCollectionChange(cardId, action) {
    setCollectionCount((prev) => {
      const updated = [...prev];
      if (action === "add" && !updated.includes(cardId)) updated.push(cardId);
      if (action === "remove") return updated.filter((id) => id !== cardId);
      return updated;
    });
  }

  return (
    <div className="w-4/5 h-[calc(100vh-7em)] overflow-scroll">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white flex border-b border-gray-300 shadow-md py-2 px-8 justify-between items-center">
        {/* Custom Dropdown */}
        <div className="relative text-sm">
          {currentSetDetails[0].details.details.name}
        </div>

        {/* Card Count */}
        <div className="text-gray-600 text-sm">
          <span className="inline-block mr-2">
            {loading ? "..." : collectionCount.length}
          </span>
          <span className="inline-block mr-2">/</span>
          {`${cards.length} cards`}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5">
        {loading ? (
          <div className="col-span-5 text-center py-10 text-gray-500">
            Loading...
          </div>
        ) : (
          cards.map((card) => (
            <CardItem
              active={collectionCount}
              key={card.details.id}
              details={card.details}
              card_id={card.id}
              set_id={card.set_id}
              onCollectionChange={handleCollectionChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
