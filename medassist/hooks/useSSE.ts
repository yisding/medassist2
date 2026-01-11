"use client";

import { useState, useEffect, useCallback } from "react";

interface SSEState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  thinking: string[];
  toolCalls: Array<{ tool: string; input: unknown }>;
}

export function useSSE<T>(url: string, enabled: boolean = true) {
  const [state, setState] = useState<SSEState<T>>({
    data: null,
    isLoading: false,
    error: null,
    thinking: [],
    toolCalls: [],
  });

  const fetchData = useCallback(() => {
    if (!enabled) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      thinking: [],
      toolCalls: [],
    }));

    const eventSource = new EventSource(url);

    eventSource.addEventListener("thinking", (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        thinking: [...prev.thinking, data.content],
      }));
    });

    eventSource.addEventListener("tool_use", (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        toolCalls: [...prev.toolCalls, { tool: data.tool, input: data.input }],
      }));
    });

    eventSource.addEventListener("result", (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        data: data as T,
      }));
    });

    eventSource.addEventListener("error", (event) => {
      if (event instanceof MessageEvent) {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          error: data.message,
          isLoading: false,
        }));
      }
      eventSource.close();
    });

    eventSource.addEventListener("done", () => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      eventSource.close();
    });

    eventSource.onerror = () => {
      setState((prev) => ({
        ...prev,
        error: "Connection error",
        isLoading: false,
      }));
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url, enabled]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}
