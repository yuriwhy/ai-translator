import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for lower latency (speed) as requested
const TRANSLATION_MODEL = 'gemini-2.5-flash';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

export const translateText = async (
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> => {
  if (!text || !text.trim()) return "";

  try {
    const isAuto = sourceLang.code === 'auto';
    
    // Construct the prompt
    const prompt = isAuto
      ? `Translate the following text to ${targetLang.name}. Detect the source language automatically. \n\nText:\n${text}`
      : `Translate the following text from ${sourceLang.name} to ${targetLang.name}. \n\nText:\n${text}`;

    const response = await ai.models.generateContent({
      model: TRANSLATION_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are a professional translator. Provide only the direct translation. Preserve formatting, capitalization, and punctuation where possible. Do not add conversational filler, notes, or explanations. If the text is untranslatable (e.g., numbers, symbols), return it as is.",
        temperature: 0.3,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};

// Helper to decode base64 audio string
const decodeAudioData = async (
    base64Data: string, 
    audioContext: AudioContext
): Promise<AudioBuffer> => {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode the audio data (GenAI returns raw PCM usually but TTS endpoint returns encapsulated format often, 
    // the example code uses standard decodeAudioData which handles headers if present, or we treat as raw if needed.
    // The TTS model returns a format that decodeAudioData can usually handle if stripped or if it's wav/mp3 wrapped.
    // However, the specific GenAI TTS example uses raw PCM decoding logic if headerless, 
    // but the preview-tts model typically returns usable audio bytes. 
    // Let's stick to the robust browser decode first.
    return await audioContext.decodeAudioData(bytes.buffer);
};

export const playTextToSpeech = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    try {
        const response = await ai.models.generateContent({
            model: TTS_MODEL,
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' }, // 'Puck' is a clear, neutral voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!base64Audio) {
            throw new Error("No audio data received");
        }

        // Initialize AudioContext only on user action (which this function assumes)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate: 24000 });
        
        // GenAI TTS often returns raw PCM data in the inlineData. 
        // We need to construct the buffer manually as per the official JS SDK examples for raw PCM.
        // However, let's first try standard decode for flexibility, if that fails, we fallback to raw PCM.
        // Actually, for gemini-2.5-flash-preview-tts, the output is often raw PCM.
        
        // Decode logic from SDK example for raw PCM
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        // The default sample rate for Gemini TTS is 24000Hz
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        
        // Convert Int16 to Float32
        for (let i = 0; i < dataInt16.length; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);

        // Return a promise that resolves when audio finishes
        return new Promise((resolve) => {
            source.onended = () => {
                resolve();
                audioContext.close();
            };
        });

    } catch (error) {
        console.error("TTS error:", error);
        throw new Error("Failed to generate speech.");
    }
};