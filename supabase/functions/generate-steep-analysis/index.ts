
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// This function requires the GOOGLE_API_KEY to be set in Supabase Edge Function secrets.
const GEMINI_API_KEY = Deno.env.get('GOOGLE_API_KEY')
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

interface SteepFactor {
  factor: 'Social' | 'Technological' | 'Economic' | 'Environmental' | 'Political'
  analysis: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pdfContent } = await req.json()

    if (!pdfContent) {
      return new Response(JSON.stringify({ error: 'pdfContent is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    if (!GEMINI_API_KEY) {
      console.error('GOOGLE_API_KEY is not set in Supabase secrets.')
      return new Response(JSON.stringify({ error: 'AI provider API key is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const prompt = `
      Based on the following case study text, perform a STEEP analysis.
      Identify the key Social, Technological, Economic, Environmental, and Political factors.
      For each factor, provide a concise analysis of its impact on the business or strategic landscape described in the text.

      Return the analysis as a valid JSON array of objects. Each object should have two keys: "factor" and "analysis".
      The "factor" key should be one of "Social", "Technological", "Economic", "Environmental", "Political".
      The "analysis" key should be a string containing your analysis for that factor. Do not include any extra text or markdown formatting like \`\`\`json.

      Case Study Text:
      ---
      ${pdfContent}
      ---
    `

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
        }
      }),
    })

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text()
      console.error('Gemini API error:', errorBody)
      return new Response(JSON.stringify({ error: 'Failed to call Gemini API', details: errorBody }), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const geminiData = await geminiResponse.json()
    const steepAnalysis = geminiData.candidates[0].content.parts[0].text;
    
    return new Response(JSON.stringify({ steepAnalysis: JSON.parse(steepAnalysis) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in generate-steep-analysis function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
