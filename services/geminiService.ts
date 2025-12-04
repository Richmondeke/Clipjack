
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptGenerationRequest } from "../types";
import { GEMINI_API_KEYS } from "../constants";

// Helper to get API Key strictly from env, local storage, or constants
export const getApiKey = () => {
    // 1. Try environment variable
    if (process.env.API_KEY) {
        return process.env.API_KEY;
    }
    // 2. Try Local Storage
    const localKey = localStorage.getItem('genavatar_gemini_key');
    if (localKey) {
        return localKey;
    }
    // 3. Try User provided key from constants
    if (GEMINI_API_KEYS.length > 0 && GEMINI_API_KEYS[0]) {
        return GEMINI_API_KEYS[0];
    }
    return "";
};

// ... generateScriptContent ... (omitted, unchanged logic)
export const generateScriptContent = async (request: ScriptGenerationRequest): Promise<Record<string, string>> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Gemini API Key is missing. Please check Settings or constants.ts");
  
  const ai = new GoogleGenAI({ apiKey });
  // ... Schema setup ...
  const schema = { type: Type.OBJECT, properties: { script: { type: Type.STRING } }, required: ["script"] };
  const prompt = `Topic: ${request.topic}. Tone: ${request.tone}. Write a 60s script.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || '{"script":""}');
  } catch (error: any) {
    if (error.status === 403 || error.message?.includes('403')) {
        throw new Error("API Key Invalid/Leaked. Check Settings.");
    }
    throw error;
  }
};

// ... base64ToUint8Array & createWavHeader ... (omitted, unchanged)
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  return bytes;
}

function createWavHeader(pcmDataLength: number, sampleRate: number = 24000, numChannels: number = 1): Uint8Array {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  view.setUint8(0, 'R'.charCodeAt(0)); view.setUint8(1, 'I'.charCodeAt(0)); view.setUint8(2, 'F'.charCodeAt(0)); view.setUint8(3, 'F'.charCodeAt(0));
  view.setUint32(4, 36 + pcmDataLength, true);
  view.setUint8(8, 'W'.charCodeAt(0)); view.setUint8(9, 'A'.charCodeAt(0)); view.setUint8(10, 'V'.charCodeAt(0)); view.setUint8(11, 'E'.charCodeAt(0));
  view.setUint8(12, 'f'.charCodeAt(0)); view.setUint8(13, 'm'.charCodeAt(0)); view.setUint8(14, 't'.charCodeAt(0)); view.setUint8(15, ' '.charCodeAt(0));
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); view.setUint16(32, numChannels * 2, true); view.setUint16(34, 16, true);
  view.setUint8(36, 'd'.charCodeAt(0)); view.setUint8(37, 'a'.charCodeAt(0)); view.setUint8(38, 't'.charCodeAt(0)); view.setUint8(39, 'a'.charCodeAt(0));
  view.setUint32(40, pcmDataLength, true);
  return new Uint8Array(buffer);
}

export const combineAudioSegments = (audioDataUris: string[]): string => {
    if (audioDataUris.length === 0) return '';
    const pcmChunks: Uint8Array[] = [];
    let totalPcmLength = 0;
    for (const uri of audioDataUris) {
        try {
            const base64 = uri.split(',')[1] || uri;
            const bytes = base64ToUint8Array(base64);
            if (bytes.length > 44) {
                const pcm = bytes.slice(44);
                pcmChunks.push(pcm);
                totalPcmLength += pcm.length;
            }
        } catch (e) { console.warn("Failed to decode audio segment", e); }
    }
    if (totalPcmLength === 0) return '';
    const combinedPcm = new Uint8Array(totalPcmLength);
    let offset = 0;
    for (const chunk of pcmChunks) { combinedPcm.set(chunk, offset); offset += chunk.length; }
    const header = createWavHeader(totalPcmLength, 24000, 1); 
    const finalBytes = new Uint8Array(header.length + combinedPcm.length);
    finalBytes.set(header); finalBytes.set(combinedPcm, header.length);
    return `data:audio/wav;base64,${btoa(Array.from(finalBytes).map((byte) => String.fromCharCode(byte)).join(''))}`;
}

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Gemini API Key is missing.");
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: text }] },
      config: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } } }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned from Gemini TTS");

    const pcmBytes = base64ToUint8Array(base64Audio);
    const wavHeader = createWavHeader(pcmBytes.length, 24000, 1);
    const wavBytes = new Uint8Array(wavHeader.length + pcmBytes.length);
    wavBytes.set(wavHeader); wavBytes.set(pcmBytes, wavHeader.length);

    return `data:audio/wav;base64,${btoa(Array.from(wavBytes).map((byte) => String.fromCharCode(byte)).join(''))}`;

  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    if (error.message?.includes('API_KEY_HTTP_REFERRER_BLOCKED') || (error.details && JSON.stringify(error.details).includes('API_KEY_HTTP_REFERRER_BLOCKED'))) {
        throw new Error("Security Error: Your API Key is restricted to a different domain. Please remove domain restrictions in Google Cloud Console or add this domain.");
    }
    if (error.status === 403 || error.message?.includes('403')) {
        throw new Error("API Key Invalid or Restricted. Check Settings.");
    }
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("Daily AI quota exceeded.");
     }
     throw error;
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    try {
        const cleanBase64 = base64Image.split(',')[1] || base64Image;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: "image/png", data: cleanBase64 } },
                    { text: "Analyze this product image. Provide a detailed, concise description of the clothing item (color, fabric texture, cut, key features) suitable for generating a new high-fashion photo of it." }
                ]
            }
        });
        return response.text || "A stylish fashion item.";
    } catch (e: any) {
        console.error("Fashion analysis error:", e);
        return "A high-fashion garment.";
    }
};

export const generateFashionImage = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: { parts: [{ text: prompt }] },
            config: { 
                imageConfig: { aspectRatio: "3:4" } 
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
             if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("No image returned");

    } catch (e: any) {
        console.error("Fashion generation error:", e);
        if (e.status === 429) throw new Error("Daily Quota Exceeded. Please try again later.");
        throw new Error("Failed to generate image.");
    }
};

export const generateVeoVideo = async (prompt: string, aspectRatio: string = '16:9', model: string = 'veo-3.1-fast-generate-preview'): Promise<string> => { 
    return ""; 
}

export const generateVeoImageToVideo = async (p: string, i: string): Promise<string> => { return ""; }
export const generateVeoProductVideo = async (p: string, i: string[], r: any): Promise<string> => { return ""; }
export const generateProductShotPrompts = async (i: string, u: string): Promise<string[]> => { return []; }

// NEW: Analyze Topic for Viral Hooks
export const analyzeViralHooks = async (topic: string): Promise<any[]> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    // Enforce stricter JSON response
    const schema = {
        type: Type.OBJECT,
        properties: {
            hooks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        viralScore: { type: Type.INTEGER },
                        description: { type: Type.STRING },
                        scriptIdea: { type: Type.STRING } // Full script idea to pass to ShortsMaker
                    }
                }
            }
        }
    };

    const prompt = `
    Act as a Viral Content Strategist for TikTok/Reels.
    
    SOURCE VIDEO TOPIC: "${topic}"

    Analyze this topic and generate 3 high-retention Short Video Concepts that could be created by repurposing content like this or creating new AI videos about it.

    1. [Controversial/Hot Take]: A polarized view to drive comments.
    2. [Educational/Hack]: A "Did you know" or "How to" style.
    3. [Story/Narrative]: A compelling quick story or case study.

    Output JSON format with 'hooks' array containing objects:
    - title: Catchy name.
    - viralScore: Integer (85-99).
    - description: Marketing rationale.
    - scriptIdea: A detailed prompt for an AI Video Generator describing the visual style, hook, and narrative arc.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const text = response.text || "{}";
        const json = JSON.parse(text);
        
        // Map to ensure IDs exist
        return (json.hooks || []).map((h: any, i: number) => ({
            id: `hook_${Date.now()}_${i}`,
            title: h.title,
            viralScore: h.viralScore,
            description: h.description,
            scriptIdea: h.scriptIdea,
            startTime: '00:00', // Placeholder
            endTime: '00:60'
        }));

    } catch (e) {
        console.error("Viral analysis failed:", e);
        throw new Error("Failed to analyze viral hooks.");
    }
};
