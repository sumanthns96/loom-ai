
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfContent, steepAnalysis, scenarioMatrix, strategicOptions, dotsStrategy } = await req.json();
    
    console.log('Generating Three Horizons Implementation...');

    const prompt = `Based on the following business context and strategic framework, create a detailed Three Horizons Implementation roadmap:

PDF CONTENT:
${pdfContent}

STEEP ANALYSIS:
${steepAnalysis}

SCENARIO MATRIX:
${scenarioMatrix}

STRATEGIC OPTIONS:
${strategicOptions}

DOTS STRATEGY (Strategic Response):
${dotsStrategy}

Using the DOTS Strategic Response themes as your foundation, generate a McKinsey Three Horizons Implementation model with exactly this structure:

HORIZON 1 (0-2 years) - Core Business Optimization:
Focus 1: [Specific tactical initiative to operationalize one strategic response theme]
Focus 2: [Second tactical initiative to strengthen core business capabilities]
Strategy: [Detailed implementation approach for optimizing current operations and improving existing offerings, directly linked to strategic response themes]

HORIZON 2 (3-4 years) - Adjacent Opportunities:
Focus 1: [Tactical program to build capabilities for identified opportunities]
Focus 2: [Second program to explore adjacent markets or expand capabilities]
Strategy: [Detailed implementation approach for exploring adjacent opportunities and building emerging capabilities, aligned with strategic opportunities and responses]

HORIZON 3 (5-6 years) - Breakthrough Innovation:
Focus 1: [Long-term innovation initiative addressing strategic drivers or threats]
Focus 2: [Second breakthrough initiative for future positioning]
Strategy: [Detailed implementation approach for breakthrough innovations and disruptive capabilities, addressing strategic drivers and threats from DOTS analysis]

Each horizon should translate the high-level DOTS strategic response themes into specific, actionable tactical roadmaps. Focus on implementation details, resource allocation, and measurable outcomes.`;

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
      console.log('Generated Three Horizons Implementation:', generatedText);

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
