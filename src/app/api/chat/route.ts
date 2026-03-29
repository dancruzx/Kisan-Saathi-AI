import { NextRequest, NextResponse } from "next/server";
import { genkit } from "genkit";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey, provider, diagnosisContext } = body;

    const systemPrompt = `You are an expert AI Agronomist assisting a farmer. The conversation started with your diagnosis of their crop: ${diagnosisContext}. Your job is to answer their follow-up questions concisely and helpfully. Always keep the initial diagnosis, exact disease severity, and weather context in mind. Be empathetic to a farmer's budget constraints, providing cheap localized remedies. Respond directly (never use system headers). CRITICAL: If you discuss a specific physical item (like a plant, disease, tool, or ingredient) where a visual helps context, include an image tag in your response in the exact XML format: <IMAGE>keyword</IMAGE>. Keep keywords very brief (1-2 words). Example: "You can use <IMAGE>Neem Oil</IMAGE> spray instead."`;

    if (provider === "groq") {
      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages
      ];

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Use a currently supported fast Groq model
          messages: groqMessages,
          stream: true,
          temperature: 0.7
        })
      });

      if (!groqRes.ok) {
        throw new Error(await groqRes.text());
      }

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          const reader = groqRes.body?.getReader();
          const decoder = new TextDecoder();
          if (!reader) {
             controller.close();
             return;
          }
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.choices?.[0]?.delta?.content) {
                      controller.enqueue(encoder.encode(data.choices[0].delta.content));
                    }
                  } catch (e) {}
                }
              }
            }
          } finally {
            reader.releaseLock();
            controller.close();
          }
        }
      });

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    // Google Gemini Stream Generation via Genkit
    const ai = genkit({
      plugins: [googleAI({ apiKey })],
    });

    // Map history to the Genkit {role, content: [{text}]} internal struct
    const genkitMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      content: [{ text: m.content }]
    }));

    const history = genkitMessages.slice(0, -1);
    const finalPrompt = genkitMessages[genkitMessages.length - 1].content[0].text;

    const responseStream = await ai.generateStream({
      model: gemini20Flash,
      system: systemPrompt,
      messages: history.length > 0 ? history : undefined,
      prompt: finalPrompt,
    });

    const encoder = new TextEncoder();
    const streamOut = new ReadableStream({
      async start(controller) {
        try {
          // Iterate the iterable chunk emitted by genkit's generateStream
          for await (const chunk of responseStream.stream) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (e) {
          console.error("Genkit Stream Error:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(streamOut, { 
      headers: { "Content-Type": "text/plain; charset=utf-8" } 
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: error.message || "Failed to respond." }, { status: 500 });
  }
}
