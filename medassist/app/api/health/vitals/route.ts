import { query } from "@anthropic-ai/claude-agent-sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { VitalsSchema, Vitals } from "@/lib/types";
import { getCached, setCache } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_KEY = "health:vitals";

export async function GET() {
  console.log("[vitals] Starting vitals query...");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Check cache first
      const cached = getCached<Vitals>(CACHE_KEY);
      if (cached) {
        console.log("[vitals] Returning cached result");
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
            "The Bash tool is running in a MacOS environment. You can use ggrep for GNU grep.\n\n" +
            "Find the most recent hospital visit and extract:\n" +
            "- The patient's name\n" +
            "- Heart rate (in bpm)\n" +
            "- Weight (in pounds/lbs - convert from kg if needed by multiplying by 2.205)\n" +
            "- The date of the visit\n\n" +
            "Return the patient name and these vital signs from the latest visit.",
          options: {
            allowedTools: ["Read", "Bash", "Grep", "Glob"],
            model: "claude-haiku-4-5",
            betas: ["context-1m-2025-08-07"],
            outputFormat: betaZodOutputFormat(VitalsSchema),
            cwd: process.cwd() + "/data",
          },
        })) {
          console.log("[vitals] Message type:", message.type);
          if (message.type === "result" && message.subtype === "success") {
            console.log("[vitals] Got result:", JSON.stringify(message.structured_output, null, 2));
            // Cache the result
            setCache(CACHE_KEY, message.structured_output);
            sendEvent("result", message.structured_output);
          } else if (message.type === "assistant") {
            for (const block of message.message.content) {
              if (block.type === "thinking") {
                console.log("[vitals] Thinking:", block.thinking.substring(0, 100) + "...");
                sendEvent("thinking", { content: block.thinking });
              } else if (block.type === "text") {
                console.log("[vitals] Text:", block.text.substring(0, 100) + "...");
                sendEvent("text", { content: block.text });
              } else if (block.type === "tool_use") {
                console.log("[vitals] Tool use:", block.name, JSON.stringify(block.input));
                sendEvent("tool_use", { tool: block.name, input: block.input });
              }
            }
          }
        }
        console.log("[vitals] Query complete");
        sendEvent("done", {});
      } catch (error) {
        console.error("[vitals] Error:", error);
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
