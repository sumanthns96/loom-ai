
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// This function requires the GOOGLE_API_KEY to be set in Supabase Edge Function secrets.
const GEMINI_API_KEY = Deno.env.get('GOOGLE_API_KEY')
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

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
    console.log('Received request with pdfContent length:', pdfContent?.length || 0)

    if (!pdfContent) {
      console.error('No pdfContent provided')
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

    console.log('Making request to Gemini API...')
    
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

    console.log('Gemini API response status:', geminiResponse.status)

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text()
      console.error('Gemini API error response:', errorBody)
      return new Response(JSON.stringify({ 
        error: 'Failed to call Gemini API', 
        details: errorBody,
        status: geminiResponse.status 
      }), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const geminiData = await geminiResponse.json()
    console.log('Gemini API response data:', JSON.stringify(geminiData, null, 2))
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      console.error('Invalid Gemini API response structure:', geminiData)
      return new Response(JSON.stringify({ error: 'Invalid API response structure' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const steepAnalysisText = geminiData.candidates[0].content.parts[0].text;
    console.log('Raw STEEP analysis text:', steepAnalysisText)
    
    let steepAnalysis: SteepFactor[]
    try {
      steepAnalysis = JSON.parse(steepAnalysisText)
    } catch (parseError) {
      console.error('Failed to parse STEEP analysis JSON:', parseError)
      console.error('Raw text that failed to parse:', steepAnalysisText)
      
      // Fallback: create a basic structure if parsing fails
      steepAnalysis = [
        { factor: 'Social', analysis: 'Analysis could not be generated automatically. Please try again.' },
        { factor: 'Technological', analysis: 'Analysis could not be generated automatically. Please try again.' },
        { factor: 'Economic', analysis: 'Analysis could not be generated automatically. Please try again.' },
        { factor: 'Environmental', analysis: 'Analysis could not be generated automatically. Please try again.' },
        { factor: 'Political', analysis: 'Analysis could not be generated automatically. Please try again.' }
      ]
    }
    
    console.log('Final STEEP analysis:', steepAnalysis)
    
    return new Response(JSON.stringify({ steepAnalysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in generate-steep-analysis function:', error)
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
