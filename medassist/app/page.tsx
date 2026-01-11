"use client";

import { useEffect } from "react";
import { useSSE } from "@/hooks/useSSE";
import { BottomNav } from "@/components/BottomNav";
import { HealthSnapshotCard } from "@/components/HealthSnapshotCard";
import { ConditionCard } from "@/components/ConditionCard";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { setConditions } from "@/lib/conditionStore";
import type { HealthConditions, Vitals } from "@/lib/types";

export default function DashboardPage() {
  const {
    data: conditions,
    isLoading: conditionsLoading,
    thinking: conditionsThinking,
    toolCalls: conditionsToolCalls,
  } = useSSE<HealthConditions>("/api/health/conditions");

  const {
    data: vitals,
    isLoading: vitalsLoading,
    thinking: vitalsThinking,
    toolCalls: vitalsToolCalls,
  } = useSSE<Vitals>("/api/health/vitals");

  const isLoading = conditionsLoading || vitalsLoading;
  const thinking = [...conditionsThinking, ...vitalsThinking];
  const toolCalls = [...conditionsToolCalls, ...vitalsToolCalls];

  // Store conditions when loaded
  useEffect(() => {
    if (conditions?.conditions) {
      setConditions(conditions.conditions);
    }
  }, [conditions]);

  // Separate ongoing and resolved conditions
  const ongoingConditions =
    conditions?.conditions.filter((c) => c.status === "ongoing") || [];

  const resolvedConditions =
    conditions?.conditions.filter((c) => c.status === "resolved") || [];

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark pb-24 overflow-x-hidden shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between p-6 pb-2 pt-12 sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="bg-gradient-to-br from-sage-medium to-primary rounded-full size-12 shadow-sm border-2 border-white dark:border-gray-700 flex items-center justify-center text-white font-bold text-lg">
              {vitals?.patientName?.charAt(0) || "U"}
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-white dark:border-background-dark"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Welcome back,
            </span>
            <h2 className="text-sage-dark dark:text-white text-xl font-bold leading-tight tracking-tight">
              {vitals?.patientName || "User"}
            </h2>
          </div>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-white/10 text-sage-dark dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
          <span className="material-symbols-outlined text-[24px]">
            notifications
          </span>
        </button>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6">
        {/* Health Snapshot Section */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="text-sage-dark dark:text-white text-lg font-bold tracking-tight">
              Health Snapshot
            </h3>
            <button className="text-sage-medium dark:text-primary text-sm font-semibold flex items-center gap-1 hover:opacity-80">
              Details{" "}
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <HealthSnapshotCard
              icon="ecg_heart"
              iconBgColor="bg-red-50 dark:bg-red-900/20"
              iconColor="text-red-500"
              value={vitals?.heartRate || 72}
              unit="bpm"
              label="Heart Rate"
              status="Normal"
              isLoading={vitalsLoading}
            />
            <HealthSnapshotCard
              icon="monitor_weight"
              iconBgColor="bg-blue-50 dark:bg-blue-900/20"
              iconColor="text-blue-500"
              value={vitals?.weight || 141}
              unit="lbs"
              label="Weight"
              status="Stable"
              isLoading={vitalsLoading}
            />
          </div>
        </section>

        {/* Conditions Section */}
        <section>
          <h3 className="text-sage-dark dark:text-white text-lg font-bold tracking-tight mb-4">
            Conditions
          </h3>
          <div className="flex flex-col gap-4">
            {conditionsLoading ? (
              <>
                <ConditionCard name="" isLoading={true} />
                <ConditionCard name="" isLoading={true} />
              </>
            ) : ongoingConditions.length > 0 ? (
              ongoingConditions.map((condition, idx) => (
                <ConditionCard
                  key={idx}
                  name={condition.name}
                  diagnosedDate={condition.diagnosedDate}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No ongoing conditions found.
              </p>
            )}
          </div>
        </section>

        {/* Previous Conditions Section */}
        {resolvedConditions.length > 0 && (
          <section className="pb-6">
            <h3 className="text-sage-dark dark:text-white text-lg font-bold tracking-tight mb-4">
              Previous Conditions
            </h3>
            <div className="flex flex-col gap-4">
              {resolvedConditions.map((condition, idx) => (
                <ConditionCard
                  key={idx}
                  name={condition.name}
                  diagnosedDate={condition.diagnosedDate}
                  isResolved={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <LoadingIndicator
        thinking={thinking}
        toolCalls={toolCalls}
        isLoading={isLoading}
      />
      {/* <BottomNav /> */}
    </div>
  );
}
