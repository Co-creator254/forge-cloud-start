
import React, { useEffect, useState } from 'react';
import { useAssistantData } from '@/hooks/use-assistant-data';
import { useAssistantMessages } from '@/hooks/use-assistant-messages';
import AssistantCard from '@/components/ai-assistant/AssistantCard';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, WifiOff, Mic, MicOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const FarmerAIAssistant: React.FC = () => {
  // Fetch all agricultural data from Supabase
  const { data, dataLoading, error, isRealData } = useAssistantData();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  
  // Setup messaging functionality
  const { messages, isLoading, handleSendMessage } = useAssistantMessages(
    data.markets,
    data.forecasts,
    data.warehouses,
    data.transporters
  );

  // Show toast notification when there's an error with data loading
  useEffect(() => {
    if (error) {
      toast({
        title: "Data Loading Issue",
        description: error + " Using fallback data instead.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [error, toast]);

  // Voice recording functionality
  const startRecording = async () => {
    try {
      setRecordingStatus('requesting_permission');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const audioChunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
      
      recorder.onstop = async () => {
        setRecordingStatus('processing');
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (base64Audio) {
            try {
              // Call Supabase Edge Function for speech-to-text
              const { data, error } = await supabase.functions.invoke('transcribe-audio', {
                body: { audio: base64Audio }
              });
              
              if (error) throw error;
              
              if (data?.text) {
                handleSendMessage(data.text);
                toast({
                  title: "Voice Transcribed",
                  description: `"${data.text}"`,
                });
              } else {
                toast({
                  title: "Transcription Error",
                  description: "Could not transcribe audio. Please try again or type your message.",
                  variant: "destructive",
                });
              }
            } catch (err) {
              console.error("Error transcribing audio:", err);
              toast({
                title: "Transcription Failed",
                description: "Could not process audio. Please try typing your message instead.",
                variant: "destructive",
              });
            }
          }
          
          setRecordingStatus('idle');
        };
      };
      
      recorder.start();
      setIsRecording(true);
      setRecordingStatus('recording');
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setRecordingStatus('idle');
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="relative">
      {dataLoading ? (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10"
          variant="outline"
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading live data...
        </Badge>
      ) : isRealData ? (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10"
          variant="secondary"
        >
          Using Live Market Data
        </Badge>
      ) : (
        <Badge 
          className="absolute top-0 right-0 mr-4 mt-4 z-10 bg-amber-200 text-amber-800 border-amber-300"
          variant="outline"
        >
          <WifiOff className="h-3 w-3 mr-1" /> 
          Connection Issue - Retry
        </Badge>
      )}
      
      {error && !dataLoading && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            <p className="text-xs opacity-80">We're experiencing difficulties connecting to our data sources. Please check your internet connection and try again.</p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <Button
          size="icon"
          variant="outline"
          className={`rounded-full ${recordingStatus === 'recording' ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={recordingStatus === 'processing' || recordingStatus === 'requesting_permission'}
        >
          {recordingStatus === 'recording' ? (
            <MicOff className="h-4 w-4" />
          ) : recordingStatus === 'processing' || recordingStatus === 'requesting_permission' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        {recordingStatus === 'recording' && (
          <span className="text-sm text-red-600 animate-pulse">Recording... Click to stop</span>
        )}
        {recordingStatus === 'processing' && (
          <span className="text-sm text-muted-foreground">Processing audio...</span>
        )}
      </div>
      
      <AssistantCard
        title="Agricultural Market Assistant"
        description="Ask about market demand, prices, forecasts, and the best places to sell your produce"
        messages={messages}
        isLoading={isLoading}
        dataLoading={dataLoading}
        error={error}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default FarmerAIAssistant;
