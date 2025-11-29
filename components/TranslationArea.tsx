import React, { useRef, useEffect, useState } from 'react';
import { Copy, Volume2, X, Loader2, Check } from 'lucide-react';
import { playTextToSpeech } from '../services/geminiService';
import { CustomizationSettings } from '../types';
import { TEXT_COLORS } from '../constants';

interface TranslationAreaProps {
  text: string;
  setText?: (text: string) => void;
  placeholder: string;
  readonly?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  onBlur?: () => void;
  customization?: CustomizationSettings;
}

// Simple internal Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div className="relative group/tooltip inline-block">
        {children}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-20">
            {content}
            {/* Arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
        </span>
    </div>
);

const TranslationArea: React.FC<TranslationAreaProps> = ({
  text,
  setText,
  placeholder,
  readonly = false,
  isLoading = false,
  onClear,
  onBlur,
  customization,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-resize text area
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(160, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSpeak = async () => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    try {
        await playTextToSpeech(text);
    } catch (error) {
        console.error("Speech playback failed", error);
    } finally {
        setIsSpeaking(false);
    }
  };

  const handleClear = () => {
      if(onClear) onClear();
  }

  // Determine Custom Styles
  const fontStyle = customization ? { fontFamily: customization.fontFamily } : {};
  const colorClass = customization 
    ? TEXT_COLORS.find(c => c.id === customization.textColor)?.tailwindClass || 'text-gray-800 dark:text-gray-100'
    : 'text-gray-800 dark:text-gray-100';

  return (
    <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 min-h-[200px] flex flex-col">
      <div className="flex-1 p-5">
        {isLoading ? (
          <div className="animate-pulse space-y-4 pt-2">
             <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
             <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
             <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className={`w-full h-full resize-none bg-transparent outline-none text-xl sm:text-2xl placeholder-gray-300 dark:placeholder-gray-600 leading-relaxed font-normal ${readonly ? 'cursor-default' : ''} ${colorClass}`}
            style={fontStyle}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText && setText(e.target.value)}
            onBlur={onBlur}
            readOnly={readonly}
            spellCheck={!readonly}
          />
        )}
      </div>

      <div className="p-3 flex items-center justify-between border-t border-transparent group-hover:border-gray-50 dark:group-hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-2">
            {text && !isLoading && (
                 <Tooltip content="Listen (Gemini TTS)">
                     <button 
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                    >
                        {isSpeaking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                 </Tooltip>
            )}
        </div>
        
        <div className="flex items-center gap-1">
          {text && !readonly && onClear && (
            <Tooltip content="Clear text">
                <button
                onClick={handleClear}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                <X className="w-5 h-5" />
                </button>
            </Tooltip>
          )}
          {text && !isLoading && (
             <Tooltip content={isCopied ? "Copied!" : "Copy translation"}>
                 <button
                    onClick={handleCopy}
                    className={`p-2 rounded-full transition-all duration-200 ${
                        isCopied 
                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                        : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                >
                    {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
             </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationArea;