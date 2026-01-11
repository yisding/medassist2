import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt:
    "My health records are in the records/ folder in a mix of XML and PDF files. " +
    "The PDF file is very large, but all of the data should also be in the XML files.\n" +
    "The Bash tool is running in a MacOS environment. You can use ggrep for GNU grep. \n"
    "Is there data on health costs here?",
  options: {
    allowedTools: ["Read", "Edit", "Bash", "Glob"],
    model: "claude-sonnet-4-5-20250929",
    betas: ["context-1m-2025-08-07"],
  },
})) {
  console.log(message); // Claude reads the file, finds the bug, edits it
}
