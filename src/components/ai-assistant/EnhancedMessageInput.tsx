import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2, Mic, MicOff, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transcribeAudio, processAudioFile } from '@/services/ai/audioTranscription';

interface EnhancedMessageInputProps {
  onSendMessage: (message: string, language?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Ask about market prices, demand, or where to sell tomorrow..."
}) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [useEnhancedModel, setUseEnhancedModel] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const result = await transcribeAudio(audioBlob, useEnhancedModel);
          if (result.text) {
            setInput(result.text);
            toast({
              title: "Voice Transcribed",
              description: `"${result.text}" (${result.language})`,
            });
          } else {
            throw new Error('No text transcribed');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Transcription Failed",
            description: "Couldn't convert your voice to text. Please try typing instead.",
            variant: "destructive"
          });
        } finally {
          setIsTranscribing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly. Press the button again to stop.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Couldn't access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice message...",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    
    try {
      const result = await processAudioFile(file, useEnhancedModel);
      
      if (result.text) {
        setInput(result.text);
        toast({
          title: "Audio File Transcribed",
          description: `"${result.text}" (${result.language})`,
        });
      }
    } catch (error: any) {
      toast({
        title: "File Processing Failed",
        description: error.message || "Couldn't process audio file.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
      <div className="flex gap-2">
        <Textarea 
          ref={inputRef}
          placeholder={isRecording ? "Recording voice message..." : 
                      isTranscribing ? "Transcribing audio..." : 
                      placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 resize-none text-sm md:text-base ${
            isRecording ? 'bg-red-50 border-red-200 animate-pulse' : 
            isTranscribing ? 'bg-blue-50 border-blue-200' : ''
          }`}
          rows={2}
          disabled={isLoading || isRecording || isTranscribing}
        />
        <div className="flex flex-col gap-2">
          <Button 
            type="button" 
            size="icon" 
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            disabled={isLoading || isTranscribing}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button 
            type="button" 
            size="icon" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isRecording || isTranscribing}
            title="Upload audio file"
          >
            {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Button>
          
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || isRecording || isTranscribing || !input.trim()}
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
            {isRecording && (
                <span className="text-red-600 animate-pulse font-medium">
                🔴 Recording...
                </span>
            )}
            {isTranscribing && (
                <span className="text-blue-600 font-medium">
                🔄 Transcribing...
                </span>
            )}
        </div>

        <div className="flex items-center gap-2">
            <label htmlFor="enhanced-mode" className="text-muted-foreground cursor-pointer select-none">
                Enhanced Mode (Dialects)
            </label>
            <input
                id="enhanced-mode"
                type="checkbox"
                checked={useEnhancedModel}
                onChange={(e) => setUseEnhancedModel(e.target.checked)}
                disabled={isLoading || isRecording || isTranscribing}
                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
            />
        </div>
      </div>
    </form>
  );
};