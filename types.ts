export interface Language {
  code: string;
  name: string;
  region?: string;
}

export interface TranslationState {
  sourceLang: Language;
  targetLang: Language;
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  error: string | null;
}

export type TranslationDirection = 'source' | 'target';

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}

export interface CustomizationSettings {
  fontFamily: string;
  textColor: string;
}