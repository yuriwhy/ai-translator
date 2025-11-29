import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onDelete,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-300 transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3>Recent Translations</h3>
        </div>
        <button
          onClick={() => {
              onClear();
          }}
          className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[400px] overflow-y-auto custom-scrollbar">
        {history.map((item) => (
          <div
            key={item.id}
            className="group p-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer flex items-center justify-between gap-4"
            onClick={() => {
                onSelect(item);
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.sourceLang.name}</span>
                <ArrowRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.targetLang.name}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                 <p className="text-gray-800 dark:text-gray-200 truncate font-medium">{item.sourceText}</p>
                 <p className="text-gray-500 dark:text-gray-400 truncate text-sm">{item.translatedText}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              title="Remove from history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;