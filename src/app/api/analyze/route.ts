import { NextRequest, NextResponse } from "next/server";
import { genkit, z } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

const outputSchema = z.object({
  is_crop: z.boolean().describe("True if the image contains a plant, leaf, or crop. False if it contains unrelated objects (e.g. human, dog, computer)."),
  disease: z.string().nullable().optional().describe("The name of the detected disease, or 'Healthy' if none."),
  severity: z.string().nullable().optional().describe("Severity level. Must be one of: Low, Medium, High, Critical, or N/A."),
  organic_solution: z.string().nullable().optional().describe("Detailed, concise organic/natural remediation steps."),
  chemical_solution: z.string().nullable().optional().describe("Conventional chemical treatment. Never recommend banned chemicals."),
  weather_advisory: z.string().nullable().optional().describe("Short explanation of how the current weather affects the treatment plan."),
});

// Helper for parsing Groq output since Groq just returns raw JSON text
interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, apiKey, provider, weatherContext } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key." }, { status: 401 });
    }

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing image payload." }, { status: 400 });
    }

    // Strip prefix if any
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const mediaUrl = `data:image/jpeg;base64,${base64Data}`;

    if (provider === "groq") {
      // ----------------------------------------------------
      // FALLBACK GROQ PIPELINE (Because of EU Geo-blocking)
      // ----------------------------------------------------
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `You are Kisan Saathi, an expert Indian agronomist. Analyze this crop image. Additionally, here is the local weather: ${weatherContext || "Not provided."}. First, determine if the image is actually of a plant or crop (is_crop). If true, identify the disease and provide concise actionable advice. Never recommend banned chemicals. CRITICAL: You MUST factor the weather into your advice. Write a short weather_advisory explaining how the current weather affects the treatment plan. Return strictly structured JSON with exact keys: 'is_crop', 'disease', 'severity', 'organic_solution', 'chemical_solution', 'weather_advisory'.` 
                },
                { 
                  type: "image_url", 
                  image_url: { url: mediaUrl } 
                }
              ]
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2
        })
      });

      if (!groqRes.ok) {
        const errData = await groqRes.json();
        throw new Error(errData.error?.message || "Groq API error");
      }

      const groqData: GroqResponse = await groqRes.json();
      const content = groqData.choices[0].message.content;
      
      // Parse raw string from Groq into JSON
      const parsedData = JSON.parse(content);
      
      // Validate schema compliance dynamically matching what Genkit normally outputs
      const validatedData = outputSchema.parse(parsedData);
      
      return NextResponse.json(validatedData);
    } 
    
    // ----------------------------------------------------
    // PRIMARY GEMINI PIPELINE 
    // ----------------------------------------------------
    // Initialize Genkit dynamically with the user's explicit key
    const ai = genkit({
      plugins: [googleAI({ apiKey })],
    });

    const response = await ai.generate({
      model: gemini20Flash,
      system: `You are Kisan Saathi, an expert Indian agronomist. Analyze this crop image. Additionally, here is the local weather: ${weatherContext || "Not provided."}. Identify the disease and provide concise actionable advice. Never recommend banned chemicals. CRITICAL: You MUST factor the weather into your advice. Write a short weather_advisory explaining how the current weather affects the treatment plan. Return strictly structured JSON.`,
      prompt: [
        { text: "Analyze the health of this crop." },
        { media: { url: mediaUrl } },
      ],
      output: { schema: outputSchema },
    });

    // Extract the typed output
    const data = response.output;
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error("Analysis Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to analyze image using the provided key.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
