import { Language } from './types';

export const AUTO_DETECT: Language = { code: 'auto', name: 'Detect Language', region: 'Auto' };

export const LANGUAGES: Language[] = [
  // Africa
  { code: 'af', name: 'Afrikaans', region: 'Africa' },
  { code: 'am', name: 'Amharic', region: 'Africa' },
  { code: 'ny', name: 'Chichewa', region: 'Africa' },
  { code: 'ha', name: 'Hausa', region: 'Africa' },
  { code: 'ig', name: 'Igbo', region: 'Africa' },
  { code: 'mg', name: 'Malagasy', region: 'Africa' },
  { code: 'st', name: 'Sesotho', region: 'Africa' },
  { code: 'sn', name: 'Shona', region: 'Africa' },
  { code: 'so', name: 'Somali', region: 'Africa' },
  { code: 'sw', name: 'Swahili', region: 'Africa' },
  { code: 'xh', name: 'Xhosa', region: 'Africa' },
  { code: 'yo', name: 'Yoruba', region: 'Africa' },
  { code: 'zu', name: 'Zulu', region: 'Africa' },

  // Americas
  { code: 'ht', name: 'Haitian Creole', region: 'Americas' },
  { code: 'haw', name: 'Hawaiian', region: 'Americas' },

  // Asia
  { code: 'ar', name: 'Arabic', region: 'Asia' },
  { code: 'hy', name: 'Armenian', region: 'Asia' },
  { code: 'az', name: 'Azerbaijani', region: 'Asia' },
  { code: 'bn', name: 'Bengali', region: 'Asia' },
  { code: 'ceb', name: 'Cebuano', region: 'Asia' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', region: 'Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', region: 'Asia' },
  { code: 'tl', name: 'Filipino', region: 'Asia' },
  { code: 'ka', name: 'Georgian', region: 'Asia' },
  { code: 'gu', name: 'Gujarati', region: 'Asia' },
  { code: 'iw', name: 'Hebrew', region: 'Asia' },
  { code: 'hi', name: 'Hindi', region: 'Asia' },
  { code: 'hmn', name: 'Hmong', region: 'Asia' },
  { code: 'id', name: 'Indonesian', region: 'Asia' },
  { code: 'ja', name: 'Japanese', region: 'Asia' },
  { code: 'jw', name: 'Javanese', region: 'Asia' },
  { code: 'kn', name: 'Kannada', region: 'Asia' },
  { code: 'kk', name: 'Kazakh', region: 'Asia' },
  { code: 'km', name: 'Khmer', region: 'Asia' },
  { code: 'ko', name: 'Korean', region: 'Asia' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', region: 'Asia' },
  { code: 'ky', name: 'Kyrgyz', region: 'Asia' },
  { code: 'lo', name: 'Lao', region: 'Asia' },
  { code: 'ms', name: 'Malay', region: 'Asia' },
  { code: 'ml', name: 'Malayalam', region: 'Asia' },
  { code: 'mr', name: 'Marathi', region: 'Asia' },
  { code: 'mn', name: 'Mongolian', region: 'Asia' },
  { code: 'my', name: 'Myanmar (Burmese)', region: 'Asia' },
  { code: 'ne', name: 'Nepali', region: 'Asia' },
  { code: 'ps', name: 'Pashto', region: 'Asia' },
  { code: 'fa', name: 'Persian', region: 'Asia' },
  { code: 'pa', name: 'Punjabi', region: 'Asia' },
  { code: 'sd', name: 'Sindhi', region: 'Asia' },
  { code: 'si', name: 'Sinhala', region: 'Asia' },
  { code: 'su', name: 'Sundanese', region: 'Asia' },
  { code: 'tg', name: 'Tajik', region: 'Asia' },
  { code: 'ta', name: 'Tamil', region: 'Asia' },
  { code: 'te', name: 'Telugu', region: 'Asia' },
  { code: 'th', name: 'Thai', region: 'Asia' },
  { code: 'tr', name: 'Turkish', region: 'Asia' },
  { code: 'ur', name: 'Urdu', region: 'Asia' },
  { code: 'uz', name: 'Uzbek', region: 'Asia' },
  { code: 'vi', name: 'Vietnamese', region: 'Asia' },

  // Europe
  { code: 'sq', name: 'Albanian', region: 'Europe' },
  { code: 'eu', name: 'Basque', region: 'Europe' },
  { code: 'be', name: 'Belarusian', region: 'Europe' },
  { code: 'bs', name: 'Bosnian', region: 'Europe' },
  { code: 'bg', name: 'Bulgarian', region: 'Europe' },
  { code: 'ca', name: 'Catalan', region: 'Europe' },
  { code: 'co', name: 'Corsican', region: 'Europe' },
  { code: 'hr', name: 'Croatian', region: 'Europe' },
  { code: 'cs', name: 'Czech', region: 'Europe' },
  { code: 'da', name: 'Danish', region: 'Europe' },
  { code: 'nl', name: 'Dutch', region: 'Europe' },
  { code: 'en', name: 'English', region: 'Europe' },
  { code: 'eo', name: 'Esperanto', region: 'Europe' },
  { code: 'et', name: 'Estonian', region: 'Europe' },
  { code: 'fi', name: 'Finnish', region: 'Europe' },
  { code: 'fr', name: 'French', region: 'Europe' },
  { code: 'fy', name: 'Frisian', region: 'Europe' },
  { code: 'gl', name: 'Galician', region: 'Europe' },
  { code: 'de', name: 'German', region: 'Europe' },
  { code: 'el', name: 'Greek', region: 'Europe' },
  { code: 'hu', name: 'Hungarian', region: 'Europe' },
  { code: 'is', name: 'Icelandic', region: 'Europe' },
  { code: 'ga', name: 'Irish', region: 'Europe' },
  { code: 'it', name: 'Italian', region: 'Europe' },
  { code: 'la', name: 'Latin', region: 'Europe' },
  { code: 'lv', name: 'Latvian', region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', region: 'Europe' },
  { code: 'lb', name: 'Luxembourgish', region: 'Europe' },
  { code: 'mk', name: 'Macedonian', region: 'Europe' },
  { code: 'mt', name: 'Maltese', region: 'Europe' },
  { code: 'no', name: 'Norwegian', region: 'Europe' },
  { code: 'pl', name: 'Polish', region: 'Europe' },
  { code: 'pt', name: 'Portuguese', region: 'Europe' },
  { code: 'ro', name: 'Romanian', region: 'Europe' },
  { code: 'ru', name: 'Russian', region: 'Europe' },
  { code: 'gd', name: 'Scots Gaelic', region: 'Europe' },
  { code: 'sr', name: 'Serbian', region: 'Europe' },
  { code: 'sk', name: 'Slovak', region: 'Europe' },
  { code: 'sl', name: 'Slovenian', region: 'Europe' },
  { code: 'es', name: 'Spanish', region: 'Europe' },
  { code: 'sv', name: 'Swedish', region: 'Europe' },
  { code: 'uk', name: 'Ukrainian', region: 'Europe' },
  { code: 'cy', name: 'Welsh', region: 'Europe' },
  { code: 'yi', name: 'Yiddish', region: 'Europe' },

  // Oceania
  { code: 'mi', name: 'Maori', region: 'Oceania' },
  { code: 'sm', name: 'Samoan', region: 'Oceania' },
];

export const POPULAR_LANGUAGES_CODES = [
  'en', 'es', 'zh-CN', 'fr', 'de', 'hi', 'ar', 'pt', 'ru', 'ja', 'ko'
];

export const REGIONS = ['Popular', 'Europe', 'Asia', 'Africa', 'Americas', 'Oceania'];

// Initial default state
export const DEFAULT_SOURCE_LANG = AUTO_DETECT;
export const DEFAULT_TARGET_LANG = LANGUAGES.find(l => l.code === 'es') || LANGUAGES[0];

// Customization Constants
export const FONTS = [
  { id: 'inter', name: 'Modern', value: 'Inter, sans-serif' },
  { id: 'playfair', name: 'Elegant', value: '"Playfair Display", serif' },
  { id: 'fira', name: 'Code', value: '"Fira Code", monospace' },
];

export const TEXT_COLORS = [
  { id: 'default', name: 'Default', tailwindClass: 'text-gray-800 dark:text-gray-100', bgClass: 'bg-gray-500' },
  { id: 'blue', name: 'Ocean', tailwindClass: 'text-blue-700 dark:text-blue-300', bgClass: 'bg-blue-500' },
  { id: 'emerald', name: 'Forest', tailwindClass: 'text-emerald-700 dark:text-emerald-300', bgClass: 'bg-emerald-500' },
  { id: 'violet', name: 'Royal', tailwindClass: 'text-violet-700 dark:text-violet-300', bgClass: 'bg-violet-500' },
  { id: 'rose', name: 'Rose', tailwindClass: 'text-rose-700 dark:text-rose-300', bgClass: 'bg-rose-500' },
];