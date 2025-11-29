import React, { useEffect, useState } from 'react';
import { X, Type, Palette } from 'lucide-react';
import { CustomizationSettings } from '../types';
import { FONTS, TEXT_COLORS } from '../constants';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomizationSettings;
  onUpdate: (newSettings: CustomizationSettings) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Appearance</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Font Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <Type className="w-4 h-4" />
                <span>Typography</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => onUpdate({ ...settings, fontFamily: font.value })}
                    className={`
                      px-4 py-3 rounded-xl border-2 text-left transition-all
                      ${settings.fontFamily === font.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'border-transparent bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                    `}
                    style={{ fontFamily: font.value }}
                  >
                    <span className="text-base font-medium">{font.name}</span>
                    <p className="text-xs opacity-70 mt-1">The quick brown fox jumps over the lazy dog.</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Color Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>Text Color</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => onUpdate({ ...settings, textColor: color.id })}
                    title={color.name}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110
                      ${color.bgClass}
                      ${settings.textColor === color.id ? 'ring-4 ring-offset-2 ring-blue-200 dark:ring-offset-gray-800 dark:ring-blue-900' : ''}
                    `}
                  >
                    {settings.textColor === color.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Footer Preview Note */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-xs text-center text-gray-500 dark:text-gray-400">
            Changes apply to translation text areas immediately.
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizationPanel;