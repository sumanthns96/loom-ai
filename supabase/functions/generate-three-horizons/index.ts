
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, steepAnalysis, scenarioMatrix, strategicOptions } = await req.json();
    
    console.log('Generating Three Horizons Model...');

    const prompt = `Based on the following business context, create a McKinsey Three Horizons strategic roadmap:

PDF CONTENT:
${pdfContent}

STEEP ANALYSIS:
${steepAnalysis}

SCENARIO MATRIX:
${scenarioMatrix}

STRATEGIC OPTIONS:
${strategicOptions}

Generate a Three Horizons Model with exactly this structure:

HORIZON 1 (0-2 YEARS) - OPTIMIZE CORE BUSINESS:
Focus 1: [Specific actionable initiative for optimizing current operations]
Focus 2: [Specific actionable initiative for improving current products/services]
Strategy: [2-3 sentence description of Horizon 1 strategy focusing on core business optimization]

HORIZON 2 (3-4 YEARS) - ADJACENT OPPORTUNITIES:
Focus 1: [Specific actionable initiative for exploring adjacent markets or capabilities]
Focus 2: [Specific actionable initiative for mid-term innovation and expansion]
Strategy: [2-3 sentence description of Horizon 2 strategy focusing on adjacent growth]

HORIZON 3 (5-6 YEARS) - BREAKTHROUGH INNOVATION:
Focus 1: [Specific actionable initiative for disruptive innovation]
Focus 2: [Specific actionable initiative for future-proofing the business]
Strategy: [2-3 sentence description of Horizon 3 strategy focusing on breakthrough innovation]

Keep focus areas concise and actionable. Make strategies clear and specific to the business context.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
        }
      })
    });

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Generated Three Horizons:', generatedText);

      return new Response(JSON.stringify({ 
        success: true, 
        threeHorizons: generatedText 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('No content generated from Gemini API');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No content generated' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-three-horizons function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
