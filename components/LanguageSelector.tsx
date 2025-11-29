import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { LANGUAGES, AUTO_DETECT, POPULAR_LANGUAGES_CODES, REGIONS } from '../constants';
import { Language } from '../types';

interface LanguageSelectorProps {
  selected: Language;
  onSelect: (lang: Language) => void;
  direction: 'source' | 'target';
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected,
  onSelect,
  direction,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setTimeout(() => setSearchQuery(''), 200); // Clear after animation
    }
  }, [isOpen]);

  const showAutoDetect = direction === 'source' && (
    'detect language'.includes(searchQuery.toLowerCase()) || searchQuery === ''
  );

  const handleClose = () => {
      onClose();
  }

  // Grouping Logic
  const getGroupedLanguages = () => {
    const query = searchQuery.toLowerCase();
    
    // If searching, return a single flattened list
    if (query) {
      return {
        'Search Results': LANGUAGES.filter(lang => 
          lang.name.toLowerCase().includes(query)
        )
      };
    }

    // Otherwise return grouped
    const groups: Record<string, Language[]> = {};
    
    // 1. Popular
    groups['Popular'] = LANGUAGES.filter(lang => POPULAR_LANGUAGES_CODES.includes(lang.code));
    
    // 2. Regions
    // We filter LANGUAGES for each region, excluding popular ones if we wanted to avoid dupes, 
    // but typically it's better to show them in their region too so users find them where expected.
    // However, to keep it cleaner, let's show all in regions.
    const regions = ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'];
    
    regions.forEach(region => {
      groups[region] = LANGUAGES.filter(lang => lang.region === region);
    });

    return groups;
  };

  const groupedLanguages = getGroupedLanguages();
  const hasResults = Object.values(groupedLanguages).some(group => group.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
        
        {/* Header with Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 transition-colors">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {direction === 'source' ? 'Translate from' : 'Translate to'}
                 </h2>
                 <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search languages"
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-900 border-2 border-transparent focus:border-blue-600 dark:focus:border-blue-500 rounded-lg pl-10 pr-4 py-3 outline-none text-gray-700 dark:text-gray-200 transition-all placeholder-gray-500 dark:placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            
            {showAutoDetect && (
                <div className="mb-4">
                     <button
                        onClick={() => {
                        onSelect(AUTO_DETECT);
                        onClose();
                        }}
                        className={`
                        w-full px-4 py-3 text-left rounded-lg text-sm font-medium transition-all flex items-center justify-between
                        ${selected.code === AUTO_DETECT.code 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-800' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-full ${selected.code === AUTO_DETECT.code ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                <Globe className="w-4 h-4" />
                            </div>
                            <span>{AUTO_DETECT.name}</span>
                        </div>
                        {selected.code === AUTO_DETECT.code && <Check className="w-4 h-4" />}
                    </button>
                </div>
            )}

            {Object.entries(groupedLanguages).map(([groupName, languages]) => {
                if (languages.length === 0) return null;
                return (
                    <div key={groupName} className="mb-6">
                         {!searchQuery && (
                             <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-10">
                                 {groupName}
                             </h3>
                         )}
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                             {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        onSelect(lang);
                                        onClose();
                                    }}
                                    className={`
                                    px-4 py-3 text-left rounded-lg text-sm font-medium transition-all flex items-center justify-between group
                                    ${selected.code === lang.code 
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-800' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                    `}
                                >
                                    <span>{lang.name}</span>
                                    {selected.code === lang.code && <Check className="w-4 h-4" />}
                                </button>
                             ))}
                         </div>
                    </div>
                );
            })}
            
             {!hasResults && !showAutoDetect && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500">
                    <Search className="w-8 h-8 mb-2 opacity-20" />
                    <p>No languages found</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;