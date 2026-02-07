
import { pipeline } from '@huggingface/transformers';
import { supabase } from '@/integrations/supabase/client';
import { detectDialect } from './dialectDetection';

let whisperModel: any = null;

// Initialize Whisper model for audio transcription (Client-side)
const initWhisperModel = async () => {
  if (!whisperModel) {
    try {
      // Try with WebGPU first for better performance
      whisperModel = await pipeline(
        'automatic-speech-recognition',
        'openai/whisper-tiny',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU', error);
      // Fallback to CPU
      whisperModel = await pipeline(
        'automatic-speech-recognition',
        'openai/whisper-tiny'
      );
    }
  }
  return whisperModel;
};

// Transcribe using Supabase Edge Function (High Accuracy / Dialect Support)
export const transcribeWithEdgeFunction = async (audioBlob: Blob, purpose: 'transcribe' | 'translate_to_english' = 'transcribe'): Promise<{
  text: string;
  language?: string;
  translated_text?: string;
}> => {
  try {
    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    
    const base64Audio = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/webm;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });

    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { 
        audio: base64Audio,
        purpose 
      }
    });

    if (error) throw error;

    return {
      text: data.text,
      language: data.detected_language,
      translated_text: data.translated_text
    };
  } catch (error) {
    console.error('Edge function transcription failed:', error);
    throw error;
  }
};

// Transcribe audio with language detection (Hybrid Strategy)
export const transcribeAudio = async (
  audioBlob: Blob, 
  useEnhancedModel: boolean = false
): Promise<{
  text: string;
  language: string;
  confidence: number;
  translated_text?: string;
}> => {
  // Strategy:
  // 1. If Enhanced Model requested (for Dialects), use Edge Function
  // 2. Otherwise/Fallback, use Client-side Whisper

  if (useEnhancedModel) {
    try {
      const result = await transcribeWithEdgeFunction(audioBlob, 'translate_to_english');
      return {
        text: result.text,
        language: result.language || 'unknown',
        confidence: 0.95, // Assumed higher for server-side models
        translated_text: result.translated_text
      };
    } catch (error) {
      console.warn('Enhanced transcription failed, falling back to local model:', error);
      // Fallback to local model logic below
    }
  }

  try {
    const model = await initWhisperModel();
    
    // Convert blob to array buffer for processing
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    // Transcribe with language detection
    const result = await model(arrayBuffer, {
      language: 'auto', // Auto-detect language
      task: 'transcribe'
    });
    

    const text = result.text || '';
    const dialectResult = detectDialect(text);
    
    return {
      text: text.trim(),
      language: dialectResult.dialect,
      confidence: 0.85 // Whisper typically has good confidence
    };
  } catch (error) {
    console.error('Local audio transcription failed:', error);
    throw new Error('Failed to transcribe audio. Please check your microphone or internet connection.');
  }
};

// Process audio file with validation
export const processAudioFile = async (file: File, useEnhancedModel: boolean = false): Promise<{
  text: string;
  language: string;
  confidence: number;
  translated_text?: string;
}> => {
  // Validate file type
  if (!file.type.startsWith('audio/')) {
    throw new Error('Please select a valid audio file');
  }
  
  // Validate file size (max 10MB for better performance)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Audio file too large. Please use a file smaller than 10MB');
  }
  
  try {
    return await transcribeAudio(file, useEnhancedModel);
  } catch (error) {
    console.error('Audio processing failed:', error);
    throw new Error('Failed to process audio file. Please try again.');
  }
};

// Convert audio blob to supported format if needed
export const convertAudioFormat = async (blob: Blob): Promise<Blob> => {
  // Check if already in supported format
  // Note: FLAC is often better for ASR APIs if available, but wav/webm work
  if (blob.type.includes('wav') || blob.type.includes('mp3') || blob.type.includes('webm')) {
    return blob;
  }
  
  try {
    // Use Web Audio API to convert if needed
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Convert to WAV format
    const wavBlob = audioBufferToWav(audioBuffer);
    return wavBlob;
  } catch (error) {
    console.warn('Audio conversion failed, using original:', error);
    return blob;
  }
};

// Convert AudioBuffer to WAV blob
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert audio data
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
};
