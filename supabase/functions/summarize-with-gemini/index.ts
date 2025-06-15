
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }

    console.log('Input text to summarize:', text);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize this text in EXACTLY 8 words or less. Count carefully.

Examples of good 8-word summaries:
- "Focus AI safety research community engagement" (6 words)
- "Build reputation through responsible AI development" (6 words)
- "Invest heavily safety research transparency initiatives" (6 words)
- "Prioritize safety applications minimal risks acceptance" (6 words)

Text to summarize: "${text}"

Return only the summary, nothing else:`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 20
        }
      }),
    });

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    let summarizedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!summarizedText) {
      console.error('No summarized text from Gemini API');
      // Fallback: create a simple 8-word summary
      const words = text.split(' ').slice(0, 8);
      summarizedText = words.join(' ');
    } else {
      // Clean up the response
      summarizedText = summarizedText.trim().replace(/['"]/g, '');
      
      // Ensure it's not more than 8 words
      const words = summarizedText.split(' ');
      if (words.length > 8) {
        summarizedText = words.slice(0, 8).join(' ');
      }
    }

    console.log('Final summarized text:', summarizedText);

    return new Response(JSON.stringify({ summarizedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-with-gemini function:', error);
    
    // Return a fallback summary if there's an error
    const { text } = await req.json().catch(() => ({ text: '' }));
    const fallbackSummary = text ? text.split(' ').slice(0, 8).join(' ') : 'AI strategy implementation';
    
    return new Response(JSON.stringify({ summarizedText: fallbackSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
