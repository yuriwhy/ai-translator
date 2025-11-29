import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft, Sparkles, ChevronDown, Moon, Sun, SlidersHorizontal } from 'lucide-react';
import { LANGUAGES, DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG, AUTO_DETECT, FONTS } from './constants';
import { Language, HistoryItem, CustomizationSettings } from './types';
import { translateText } from './services/geminiService';
import { getHistory, saveHistoryItem, deleteHistoryItem, clearHistory } from './services/historyService';
import LanguageSelector from './components/LanguageSelector';
import TranslationArea from './components/TranslationArea';
import HistoryList from './components/HistoryList';
import CustomizationPanel from './components/CustomizationPanel';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const STORAGE_KEY_SOURCE = 'gemini_translator_source_code';
const STORAGE_KEY_TARGET = 'gemini_translator_target_code';
const STORAGE_KEY_THEME = 'gemini_translator_theme';
const STORAGE_KEY_CUSTOMIZATION = 'gemini_translator_customization';

const App: React.FC = () => {
  // --- Initialization Logic ---
  
  // Initialize languages from localStorage or defaults
  const getInitialSourceLang = (): Language => {
    const savedCode = localStorage.getItem(STORAGE_KEY_SOURCE);
    if (savedCode) {
      if (savedCode === 'auto') return AUTO_DETECT;
      const lang = LANGUAGES.find(l => l.code === savedCode);
      if (lang) return lang;
    }
    return DEFAULT_SOURCE_LANG;
  };

  const getInitialTargetLang = (): Language => {
    const savedCode = localStorage.getItem(STORAGE_KEY_TARGET);
    if (savedCode) {
      const lang = LANGUAGES.find(l => l.code === savedCode);
      if (lang) return lang;
    }
    return DEFAULT_TARGET_LANG;
  };

  // Initialize Customization
  const getInitialCustomization = (): CustomizationSettings => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMIZATION);
    if (saved) {
      return JSON.parse(saved);
    }
    return { fontFamily: FONTS[0].value, textColor: 'default' };
  };

  const [sourceLang, setSourceLang] = useState<Language>(getInitialSourceLang);
  const [targetLang, setTargetLang] = useState<Language>(getInitialTargetLang);
  
  // Theme state: Default to true (Dark Mode) if no preference saved, or if saved is 'dark'
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    return savedTheme ? savedTheme === 'dark' : true; 
  });

  const [customization, setCustomization] = useState<CustomizationSettings>(getInitialCustomization);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isLangSelectorOpen, setIsLangSelectorOpen] = useState<boolean>(false);
  const [selectorDirection, setSelectorDirection] = useState<'source' | 'target'>('source');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const debouncedSourceText = useDebounce(sourceText, 800);

  // --- Effects ---

  // Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // Persist Languages
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOURCE, sourceLang.code);
  }, [sourceLang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TARGET, targetLang.code);
  }, [targetLang]);

  // Persist Customization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOMIZATION, JSON.stringify(customization));
  }, [customization]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // --- Handlers ---

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSwapLanguages = () => {
    if (sourceLang.code === 'auto') {
      setSourceLang(targetLang);
      setTargetLang(LANGUAGES.find(l => l.code === 'en') || LANGUAGES[0]);
    } else {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
    setSourceText(translatedText);
    setTranslatedText(sourceText); 
  };

  const openLangSelector = (direction: 'source' | 'target') => {
    setSelectorDirection(direction);
    setIsLangSelectorOpen(true);
  };

  const performTranslation = useCallback(async (text: string, source: Language, target: Language) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText(text, source, target);
      setTranslatedText(result);
    } catch (error) {
      console.error(error);
      setTranslatedText("Error during translation. Please check your connection or try again.");
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Trigger translation on debounced text change
  useEffect(() => {
    if (debouncedSourceText) {
      performTranslation(debouncedSourceText, sourceLang, targetLang);
    } else {
        setTranslatedText('');
    }
  }, [debouncedSourceText, sourceLang, targetLang, performTranslation]);

  // Save to history when the user leaves the input field (onBlur)
  const handleSaveHistory = () => {
    if (sourceText && translatedText && !isTranslating) {
        const updatedHistory = saveHistoryItem(sourceText, translatedText, sourceLang, targetLang);
        setHistory(updatedHistory);
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    const updated = clearHistory();
    setHistory(updated);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 animate-entry" style={{ animationDelay: '0.1s' }}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 dark:shadow-none shadow-lg">
                    <Sparkles className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-semibold text-gray-700 dark:text-white">Gemini <span className="text-gray-400 dark:text-gray-500 font-normal">Translate</span></h1>
            </div>
            
            <div className="flex items-center gap-2 animate-entry" style={{ animationDelay: '0.2s' }}>
              <button
                  onClick={() => setIsCustomizationOpen(true)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                  title="Customize Appearance"
              >
                  <SlidersHorizontal className="w-5 h-5" />
              </button>
              
              <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col gap-6 animate-entry" style={{ animationDelay: '0.3s' }}>
        
        {/* Language Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 sticky top-20 z-20 transition-colors duration-200">
            {/* Source Language Button */}
            <button 
                onClick={() => openLangSelector('source')}
                className="flex-1 w-full md:w-auto flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400 font-medium group"
            >
                <span className="truncate group-hover:text-blue-700 dark:group-hover:text-blue-300">{sourceLang.name}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Swap Button */}
            <button 
                onClick={handleSwapLanguages}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all active:rotate-180"
                title="Swap languages"
            >
                <ArrowRightLeft className="w-5 h-5" />
            </button>

             {/* Target Language Button */}
             <button 
                onClick={() => openLangSelector('target')}
                className="flex-1 w-full md:w-auto flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400 font-medium group"
            >
                <span className="truncate group-hover:text-blue-700 dark:group-hover:text-blue-300">{targetLang.name}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full md:h-auto min-h-[400px]">
            <div className="flex flex-col h-full">
                <TranslationArea 
                    placeholder="Enter text"
                    text={sourceText}
                    setText={setSourceText}
                    onBlur={handleSaveHistory}
                    onClear={() => {
                        setSourceText('');
                        setTranslatedText('');
                    }}
                    customization={customization}
                />
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-1 text-right transition-colors">
                    {sourceText.length} chars
                </div>
            </div>

            <div className="flex flex-col h-full">
                <TranslationArea 
                    placeholder="Translation"
                    text={translatedText}
                    readonly
                    isLoading={isTranslating}
                    customization={customization}
                />
                 <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 px-1 flex justify-between transition-colors">
                     <span>Gemini 2.5 Flash</span>
                     {translatedText && <span>{translatedText.length} chars</span>}
                </div>
            </div>
        </div>

        {/* History Section */}
        <HistoryList 
            history={history}
            onSelect={handleRestoreHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
        />

        {/* Info / Footer */}
        <div className="mt-auto pt-8 pb-4 text-center text-gray-400 dark:text-gray-600 text-sm transition-colors">
            <p>Powered by Google Gemini 2.5 Flash</p>
        </div>
      </main>

      {/* Modals */}
      <LanguageSelector 
        isOpen={isLangSelectorOpen}
        onClose={() => setIsLangSelectorOpen(false)}
        selected={selectorDirection === 'source' ? sourceLang : targetLang}
        onSelect={(lang) => {
            if (selectorDirection === 'source') setSourceLang(lang);
            else setTargetLang(lang);
        }}
        direction={selectorDirection}
      />

      {/* Customization Panel */}
      <CustomizationPanel 
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        settings={customization}
        onUpdate={setCustomization}
      />
    </div>
  );
};

export default App;