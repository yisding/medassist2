"use client";

interface LoadingIndicatorProps {
  thinking: string[];
  toolCalls: Array<{ tool: string; input: unknown }>;
  isLoading: boolean;
}

export function LoadingIndicator({
  thinking,
  toolCalls,
  isLoading,
}: LoadingIndicatorProps) {
  if (!isLoading && thinking.length === 0 && toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-md px-4 pb-6 pointer-events-auto">
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-4 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            {isLoading && (
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            )}
            <span className="text-sm font-bold text-sage-dark dark:text-white">
              {isLoading ? "Analyzing your records..." : "Analysis complete"}
            </span>
          </div>

          {toolCalls.length > 0 && (
            <div className="space-y-1">
              {toolCalls.slice(-3).map((call, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                  <span className="material-symbols-outlined text-[14px] text-sage-medium">
                    {call.tool === "Read"
                      ? "description"
                      : call.tool === "Grep"
                        ? "search"
                        : call.tool === "Glob"
                          ? "folder_open"
                          : "terminal"}
                  </span>
                  <span className="truncate">
                    Using {call.tool}
                    {typeof call.input === "object" &&
                      call.input !== null &&
                      "pattern" in call.input &&
                      `: ${(call.input as { pattern: string }).pattern}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
