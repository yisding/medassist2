import { query } from "@anthropic-ai/claude-agent-sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { MedicalHistorySchema, MedicalHistory } from "@/lib/types";
import { getCached, setCache } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_KEY = "health:timeline";

export async function GET() {
  console.log("[timeline] Starting timeline query...");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Check cache first
      const cached = getCached<MedicalHistory>(CACHE_KEY);
      if (cached) {
        console.log("[timeline] Returning cached result");
        sendEvent("result", cached);
        sendEvent("done", {});
        controller.close();
        return;
      }

      try {
        for await (const message of query({
          prompt:
            "My health records are in the records/ folder in a mix of XML and PDF files. " +
            "The PDF file is very large, but all of the data should also be in the XML files.\n" +
            "The Bash tool is running in a MacOS environment. You can use ggrep for GNU grep. \n" +
            "Avoid mental health conditions.\n" +
            "Extract a timeline of medical events from the records. For each event, provide:\n" +
            "- A unique ID\n" +
            "- The date of the event\n" +
            "- A title describing the event\n" +
            "- A brief description\n" +
            "- A category (cardiology, lab, therapy, neurology, medication, consultation)\n" +
            "- Any attachments mentioned (with name and type: pdf or image)\n" +
            "Sort the events by date, most recent first.",
          options: {
            allowedTools: ["Read", "Bash", "Grep", "Glob"],
            model: "claude-sonnet-4-5-20250929",
            betas: ["context-1m-2025-08-07"],
            outputFormat: betaZodOutputFormat(MedicalHistorySchema),
            cwd: process.cwd() + "/data",
          },
        })) {
          console.log("[timeline] Message type:", message.type);
          if (message.type === "result" && message.subtype === "success") {
            console.log("[timeline] Got result:", JSON.stringify(message.structured_output, null, 2));
            // Cache the result
            setCache(CACHE_KEY, message.structured_output);
            sendEvent("result", message.structured_output);
          } else if (message.type === "assistant") {
            for (const block of message.message.content) {
              if (block.type === "thinking") {
                console.log("[timeline] Thinking:", block.thinking.substring(0, 100) + "...");
                sendEvent("thinking", { content: block.thinking });
              } else if (block.type === "text") {
                console.log("[timeline] Text:", block.text.substring(0, 100) + "...");
                sendEvent("text", { content: block.text });
              } else if (block.type === "tool_use") {
                console.log("[timeline] Tool use:", block.name, JSON.stringify(block.input));
                sendEvent("tool_use", { tool: block.name, input: block.input });
              }
            }
          }
        }
        console.log("[timeline] Query complete");
        sendEvent("done", {});
      } catch (error) {
        console.error("[timeline] Error:", error);
        sendEvent("error", {
          message: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
