
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GOOGLE_API_KEY");
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caseContent } = await req.json();

    if (!caseContent) {
      return new Response(JSON.stringify({ error: "Missing case content in request." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `
TASK: Analyze the following case study content and identify the primary industry/sector.

CASE CONTENT:
${caseContent.substring(0, 3000)}

INSTRUCTIONS:
- Analyze the case study content to determine the primary industry
- Return a specific, clear industry name (e.g., "Beverage Industry", "Healthcare", "Automotive", "Financial Services")
- Be specific but concise (2-4 words maximum)
- Focus on the main business sector, not sub-categories
- If multiple industries are mentioned, choose the primary one

EXAMPLES:
- Beer company → "Beverage Industry"
- Hospital system → "Healthcare"
- Software company → "Technology"
- Bank → "Financial Services"
- Car manufacturer → "Automotive"
- Retail chain → "Retail"

Respond with ONLY the industry name, no explanations or additional text.
    `.trim();

    const geminiRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 50,
      }
    };

    const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiRequest),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API error:", errorText);
      return new Response(JSON.stringify({ 
        error: "Industry extraction failed", 
        industry: "Technology and Innovation" // fallback
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await geminiRes.json();
    let industry = "Technology and Innovation"; // fallback

    try {
      const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      industry = textContent.trim().replace(/['"]/g, ""); // Clean quotes
      
      // Basic validation - ensure it's a reasonable industry name
      if (!industry || industry.length < 3 || industry.length > 50) {
        industry = "Technology and Innovation";
      }
    } catch (parseError) {
      console.error("Failed to parse industry response:", parseError);
    }

    return new Response(JSON.stringify({ industry }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Unexpected error in extract-industry function:", e);
    return new Response(JSON.stringify({ 
      error: "Function error", 
      industry: "Technology and Innovation" // fallback
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
