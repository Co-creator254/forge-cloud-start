
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Hugging Face API URLs
const HF_API_URL_ASR = "https://api-inference.huggingface.co/models/facebook/mms-1b-all"; // Massive Multilingual Speech
const HF_API_URL_TRANSLATION = "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M"; // No Language Left Behind

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio, language, purpose } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    const hfToken = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!hfToken) {
      throw new Error('Hugging Face API key not configured')
    }

    console.log(`Processing audio request. Language: ${language}, Purpose: ${purpose || 'transcribe'}`)

    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0))

    // Step 1: Transcribe using MMS-1b-all (supports 1000+ languages including Swahili, Luo, Kikuyu)
    console.log("Sending to Hugging Face ASR model...")
    const asrResponse = await fetch(HF_API_URL_ASR, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "audio/flac", // MMS expects raw audio or flac usually, checking docs
      },
      body: binaryAudio,
    });

    if (!asrResponse.ok) {
        const errorText = await asrResponse.text();
        console.error(`HF ASR Error: ${errorText}`);
        throw new Error(`ASR API error: ${asrResponse.status} - ${errorText}`);
    }

    const asrResult = await asrResponse.json();
    let transcribedText = asrResult.text || "";

    console.log("Transcription result:", transcribedText);

    let finalText = transcribedText;
    let translatedText = null;

    // Step 2: Translate if needed (e.g., local dialect to English)
    // If language is not English/Swahili, or if explicit translation requested
    if (purpose === 'translate_to_english' && transcribedText) {
        console.log("Translating to English using NLLB...")
        const translationResponse = await fetch(HF_API_URL_TRANSLATION, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${hfToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: transcribedText,
                parameters: {
                    src_lang: "sw_latn", // Defaulting to Swahili as source for now, ideally detected
                    tgt_lang: "eng_Latn"
                }
            }),
        });
        
        if (translationResponse.ok) {
            const translationResult = await translationResponse.json();
            // HF Translation API returns array of objects with translation_text
            if (Array.isArray(translationResult) && translationResult.length > 0) {
                translatedText = translationResult[0].translation_text;
                console.log("Translation result:", translatedText);
            }
        } else {
             console.warn(`Translation failed: ${await translationResponse.text()}`);
        }
    }

    return new Response(
      JSON.stringify({ 
          text: finalText,
          translated_text: translatedText,
          detected_language: language || 'unknown' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in transcribe-audio function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
