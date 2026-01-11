import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt:
    "My health records are in the records/ folder in a mix of XML and PDF files. " +
    "The PDF file is very large, but all of the data should also be in the XML files.\n" +
    "The Bash tool is running in a MacOS environment. You can use ggrep for GNU grep. \n" +
    "Avoid mental health conditions.\n" +
    "Craft a single paragraph summarizing the state of my health. Summarize my health as of the last record in the file, but also help me understand historical conditions.",
  options: {
    allowedTools: ["Read", "Edit", "Bash", "Grep", "Glob"],
    model: "claude-haiku-4-5",
    betas: ["context-1m-2025-08-07"],
  },
})) {
  console.log(message); // Claude reads the file, finds the bug, edits it
}
