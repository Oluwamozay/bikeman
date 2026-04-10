import { useState, useCallback } from "react";

const STORAGE_KEY = "ocada_recently_viewed";
const MAX_ITEMS = 5;

const readRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const useRecentlyViewed = () => {
  const [recentIds, setRecentIds] = useState<string[]>(readRecent);

  const addViewed = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds, addViewed };
};
