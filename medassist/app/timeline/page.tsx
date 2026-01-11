"use client";

import { useState } from "react";
import { useSSE } from "@/hooks/useSSE";
import { BottomNav } from "@/components/BottomNav";
import { TimelineCard, TimelineCardSkeleton } from "@/components/TimelineCard";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import type { MedicalHistory } from "@/lib/types";

const filterOptions = [
  { id: "all", label: "All Events" },
  { id: "cardiology", label: "Cardiology" },
  { id: "lab", label: "Lab Results" },
  { id: "therapy", label: "Therapy" },
  { id: "medication", label: "Medication" },
];

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data, isLoading, thinking, toolCalls } =
    useSSE<MedicalHistory>("/api/health/timeline");

  // Group events by month
  const groupEventsByMonth = () => {
    if (!data?.events) return {};

    const filtered =
      activeFilter === "all"
        ? data.events
        : data.events.filter((e) => e.category === activeFilter);

    const grouped: Record<string, typeof filtered> = {};

    filtered.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });

    return grouped;
  };

  const groupedEvents = groupEventsByMonth();
  const monthKeys = Object.keys(groupedEvents);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">
            My Journey
          </h1>
          <p className="text-xs font-medium text-text-muted dark:text-gray-400">
            Your Medical History
          </p>
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <span
            className="material-symbols-outlined text-text-main dark:text-white"
            style={{ fontSize: "24px" }}
          >
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
        </button>
      </header>

      {/* Filter Chips */}
      <div className="sticky top-[72px] z-20 w-full bg-background-light dark:bg-background-dark py-3 pl-5 border-b border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pr-5">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${
                activeFilter === option.id
                  ? "bg-primary text-text-main shadow-sm"
                  : "bg-white dark:bg-card-dark border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`text-sm ${activeFilter === option.id ? "font-bold" : "font-medium"} text-text-main dark:text-gray-200`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <main className="flex-1 px-5 pt-6 pb-24">
        <div className="relative pl-4 space-y-8">
          {/* Vertical Line */}
          <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-gray-200 to-transparent dark:via-white/10"></div>

          {isLoading ? (
            <>
              {/* Loading skeleton */}
              <div className="relative flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/10 flex items-center justify-center z-10 ring-4 ring-background-light dark:ring-background-dark">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                </div>
                <div className="skeleton w-32 h-4 rounded"></div>
              </div>
              <TimelineCardSkeleton />
              <TimelineCardSkeleton />
              <TimelineCardSkeleton />
            </>
          ) : monthKeys.length > 0 ? (
            monthKeys.map((monthKey, monthIdx) => (
              <div key={monthKey}>
                {/* Month Header */}
                <div className="relative flex items-center gap-4 mb-6">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      monthIdx === 0
                        ? "bg-primary/20 dark:bg-primary/10"
                        : "bg-gray-100 dark:bg-white/10"
                    } flex items-center justify-center z-10 ring-4 ring-background-light dark:ring-background-dark`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        monthIdx === 0
                          ? "bg-primary"
                          : "bg-gray-400 dark:bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${
                      monthIdx === 0
                        ? "text-text-muted dark:text-primary"
                        : "text-text-muted dark:text-gray-500"
                    }`}
                  >
                    {monthKey}
                  </span>
                </div>

                {/* Events for this month */}
                <div className="space-y-4">
                  {groupedEvents[monthKey].map((event, eventIdx) => (
                    <TimelineCard
                      key={event.id}
                      event={event}
                      isRecent={monthIdx === 0 && eventIdx === 0}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-gray-300 dark:text-gray-600 mb-4 block">
                history
              </span>
              <p className="text-gray-500 dark:text-gray-400">
                No events found for this filter.
              </p>
            </div>
          )}
        </div>

        {/* Empty space for scroll */}
        <div className="h-10"></div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-5 z-40 lg:absolute">
        <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-text-main shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
          <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
            add
          </span>
        </button>
      </div>

      <LoadingIndicator
        thinking={thinking}
        toolCalls={toolCalls}
        isLoading={isLoading}
      />
      {/* <BottomNav /> */}
    </div>
  );
}
