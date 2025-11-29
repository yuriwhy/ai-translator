import { HistoryItem, Language } from '../types';

const STORAGE_KEY = 'gemini_translator_history';
const MAX_HISTORY = 20;

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const saveHistoryItem = (
  sourceText: string,
  translatedText: string,
  sourceLang: Language,
  targetLang: Language
): HistoryItem[] => {
  if (!sourceText.trim() || !translatedText.trim()) return getHistory();

  const history = getHistory();
  
  // Create new item
  const newItem: HistoryItem = {
    id: Date.now().toString(),
    sourceText: sourceText.trim(),
    translatedText: translatedText.trim(),
    sourceLang,
    targetLang,
    timestamp: Date.now(),
  };

  // Remove exact duplicates (same source text and target lang) to keep list clean
  // We filter out any existing item that matches the new one's core data
  const filtered = history.filter(
    item => !(
        item.sourceText.toLowerCase() === newItem.sourceText.toLowerCase() && 
        item.targetLang.code === newItem.targetLang.code
    )
  );

  // Add new item to the top
  const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY);
  
  try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (e) {
      console.error("Failed to save history", e);
  }
  
  return newHistory;
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
    const history = getHistory().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
}

export const clearHistory = (): HistoryItem[] => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};