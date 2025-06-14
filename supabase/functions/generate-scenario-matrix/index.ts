
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Gemini API BASE and KEY
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
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt in request." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prepare Gemini request
    const url = `${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`;
    const geminiRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 500,
        responseMimeType: "application/json"
      }
    };

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiRequest),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API error", errorText);
      return new Response(JSON.stringify({ error: "Gemini API error", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await geminiRes.json();

    // Extract JSON from Gemini's string response
    let textContent = "";
    try {
      textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch {
      textContent = "";
    }

    let parsed;
    try {
      // Remove any code block wrappers and parse JSON
      const safe = textContent.replace(/^\s*```json\s*|\s*```\s*$/gi, "").trim();
      parsed = JSON.parse(safe);
    } catch (err) {
      console.error("Failed to parse Gemini JSON output:", textContent, err);
      // fallback: return raw text so frontend can handle
      return new Response(JSON.stringify({ header: "", bullets: [], parseError: true, raw: textContent }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Should output: { header: string, bullets: string[] }
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.bullets) && typeof parsed.header === "string") {
      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // fallback
    return new Response(JSON.stringify({ header: "", bullets: [], parseError: true, raw: textContent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected Error in function:", e);
    return new Response(JSON.stringify({ error: "Function error", details: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
