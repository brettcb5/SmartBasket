"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { genId, useDebounce } from "@/utils/helpers";
import { Header } from "@/components/GroceryApp/Header";
import { PlannerTab } from "@/components/GroceryApp/PlannerTab";
import { ComparisonTab } from "@/components/GroceryApp/ComparisonTab";

export default function GroceryApp() {
  const [location, setLocation] = useState("Macungie, PA");
  const [radius, setRadius] = useState(10);
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState("planner");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [compareError, setCompareError] = useState(null);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  // ── AI Item Search ──────────────────────────────────────────────────────────
  const searchMutation = useMutation({
    mutationFn: async (q) => {
      const res = await fetch("/api/search-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    onSuccess: (data) => {
      setSearchResults(Array.isArray(data) ? data : []);
      setSearchError(null);
    },
    onError: () => setSearchError("Search failed. Try again."),
  });

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchMutation.mutate(debouncedQuery.trim());
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // ── Compare Mutation ────────────────────────────────────────────────────────
  const compareMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Comparison failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setComparisonResult(data);
      setCompareError(null);
      setActiveTab("comparison");
    },
    onError: (e) => setCompareError(e.message),
  });

  // ── List Management ─────────────────────────────────────────────────────────
  const addItem = useCallback((item) => {
    setList((prev) => {
      const key = item.id || item.name;
      const existing = prev.find((i) => (i.id || i.name) === key);
      if (existing) {
        return prev.map((i) =>
          (i.id || i.name) === key ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, id: item.id || genId(), quantity: 1 }];
    });
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const addCustomItem = useCallback(() => {
    const name = searchQuery.trim();
    if (!name) return;
    addItem({
      id: genId(),
      name,
      category: "Other",
      unit: "each",
      typical_price: 3.99,
    });
  }, [searchQuery, addItem]);

  const removeItem = (id) => setList((p) => p.filter((i) => i.id !== id));
  const updateQty = (id, delta) =>
    setList((p) =>
      p.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
      ),
    );

  const handleCompare = () => {
    setCompareError(null);
    compareMutation.mutate({ items: list, location, radius });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter text-[#111827]">
      <Header
        location={location}
        setLocation={setLocation}
        radius={radius}
        setRadius={setRadius}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        comparisonResult={comparisonResult}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "planner" && (
            <PlannerTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              searchMutation={searchMutation}
              searchError={searchError}
              addItem={addItem}
              addCustomItem={addCustomItem}
              searchRef={searchRef}
              list={list}
              updateQty={updateQty}
              removeItem={removeItem}
              compareError={compareError}
              compareMutation={compareMutation}
              handleCompare={handleCompare}
              location={location}
            />
          )}

          {activeTab === "comparison" && comparisonResult && (
            <ComparisonTab
              comparisonResult={comparisonResult}
              list={list}
              setActiveTab={setActiveTab}
            />
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse { animation: pulse-dot 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
