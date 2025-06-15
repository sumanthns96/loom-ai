
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
    
    console.log('Generating DOTS Strategy...');

    const prompt = `Based on the following business context, create a comprehensive DOTS Strategy analysis:

PDF CONTENT:
${pdfContent}

STEEP ANALYSIS:
${steepAnalysis}

SCENARIO MATRIX:
${scenarioMatrix}

STRATEGIC OPTIONS:
${strategicOptions}

Generate a DOTS Strategy with exactly this structure:

DRIVERS:
[3-4 key strategic drivers that will shape the organization's future - internal capabilities, market forces, technological shifts, regulatory changes]

OPPORTUNITIES:
[3-4 major strategic opportunities the organization should pursue - market expansion, innovation areas, partnership possibilities, competitive advantages]

THREATS:
[3-4 significant strategic threats that could impact the organization - competitive pressures, market disruptions, regulatory risks, technological obsolescence]

STRATEGIC RESPONSE:
[3-4 high-level strategic themes and directions that address the drivers, capitalize on opportunities, and mitigate threats - these should be strategic visions that can be operationalized through tactical roadmaps]

Keep each section focused on strategic-level insights. The Strategic Response should provide overarching strategic directions that will inform tactical planning and implementation roadmaps.`;

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
      console.log('Generated DOTS Strategy:', generatedText);

      return new Response(JSON.stringify({ 
        success: true, 
        dotsStrategy: generatedText 
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
    console.error('Error in generate-dots-strategy function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
