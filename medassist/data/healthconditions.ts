import { query } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";

const HealthConditions = z.object({
  conditions: z.array(
    z.object({
      name: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
});

for await (const message of query({
  prompt:
    "My health records are in the records/ folder in a mix of XML and PDF files. " +
    "The PDF file is very large, but all of the data should also be in the XML files.\n" +
    "The Bash tool is running in a MacOS environment. You can use ggrep for GNU grep. \n" +
    "Avoid mental health conditions.\n" +
    "List out the health conditions you find along with their dates of occurrence or if they're ongoing.",
  options: {
    allowedTools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "claude-sonnet-4-5-20250929",
    betas: ["context-1m-2025-08-07"],
    outputFormat: betaZodOutputFormat(HealthConditions)
  },
})) {
  if (message.type == "result" && message.subtype == "success") {
    console.log(JSON.stringify(message.structured_output));
  } else {
      console.log(message);
  }
}
