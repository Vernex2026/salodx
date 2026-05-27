import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "./_system-prompt.js";

export const runtime = "edge";

const MODEL_ID = "claude-haiku-4-5-20251001";

export async function GET() {
  return Response.json({
    ok: Boolean(process.env.ANTHROPIC_API_KEY),
    model: MODEL_ID,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("API key not configured", { status: 503 });
  }

  let messages: unknown;
  try {
    const body = await req.json();
    messages = (body as { messages?: unknown }).messages;
  } catch {
    return new Response("invalid JSON", { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("messages required", { status: 400 });
  }

  const result = streamText({
    model: anthropic(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: messages as NonNullable<Parameters<typeof streamText>[0]["messages"]>,
    maxOutputTokens: 600,
    temperature: 0.3,
    onError({ error }) {
      console.error("[chat] stream onError:", error);
    },
    onFinish(event) {
      console.log("[chat] stream onFinish:", {
        finishReason: event.finishReason,
        usage: event.usage,
        textLength: event.text?.length ?? 0,
      });
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let chunkCount = 0;
      try {
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(chunk));
          chunkCount++;
        }
        if (chunkCount === 0) {
          let reason = "unknown";
          try {
            reason = (await result.finishReason) ?? "unknown";
          } catch {
            // ignore
          }
          const hint =
            reason === "content-filter"
              ? "treść została odrzucona przez moderator Anthropic"
              : reason === "length"
                ? "wyczerpano maxOutputTokens"
                : `model zwrócił pustą odpowiedź (finishReason: ${reason})`;
          controller.enqueue(
            encoder.encode(`[empty-stream] ${hint}. Sprawdź Vercel Functions logs.`)
          );
        }
        controller.close();
      } catch (err) {
        const msg =
          err instanceof Error
            ? `${err.name}: ${err.message}`
            : String(err);
        controller.enqueue(
          encoder.encode(`\n\n[upstream-error] ${msg}`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
