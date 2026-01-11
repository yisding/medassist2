"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getConditionByName } from "@/lib/conditionStore";
import type { HealthCondition } from "@/lib/types";

const statusColors: Record<string, string> = {
  ongoing: "bg-primary/20 text-green-900 dark:text-green-100 border-primary/20",
  resolved: "bg-gray-100 text-gray-700 dark:text-gray-300 border-gray-200",
};

export default function ConditionDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const conditionName = decodeURIComponent(name);

  const [data, setData] = useState<HealthCondition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const condition = getConditionByName(conditionName);
    if (condition) {
      setData(condition);
    }
    setIsLoading(false);
  }, [conditionName]);

  const getStatusLabel = (status: string) => {
    return status === "ongoing" ? "Ongoing" : "Resolved";
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col antialiased selection:bg-primary/30">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full">
          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </Link>
          <h2 className="text-base font-bold tracking-tight text-center flex-1 truncate px-2">
            Condition Details
          </h2>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Scrollable Area */}
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-5 pt-6 pb-20 space-y-6">
        {isLoading ? (
          <>
            {/* Loading Skeleton */}
            <section className="flex flex-col gap-3">
              <div className="skeleton h-10 w-3/4 rounded"></div>
              <div className="flex gap-3 items-center">
                <div className="skeleton h-8 w-24 rounded-full"></div>
                <div className="skeleton h-4 w-32 rounded"></div>
              </div>
            </section>
          </>
        ) : data ? (
          <>
            {/* Header Section with Title & Chip */}
            <section className="flex flex-col gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] text-text-main dark:text-white">
                {data.name}
              </h1>
              <div className="flex flex-wrap gap-3 items-center">
                <div
                  className={`inline-flex h-8 items-center gap-x-2 rounded-full px-3 py-1 pr-4 border ${statusColors[data.status] || statusColors.ongoing}`}
                >
                  <span className="material-symbols-outlined filled text-green-700 dark:text-green-400 text-[18px]">
                    {data.status === "ongoing" ? "pending" : "check_circle"}
                  </span>
                  <span className="text-sm font-bold">
                    {getStatusLabel(data.status)}
                  </span>
                </div>
              </div>
            </section>

            {/* Details Card */}
            <section className="bg-white dark:bg-card-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-sage-bg dark:bg-white/10 text-sage-medium dark:text-primary shrink-0">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted dark:text-gray-400">Diagnosed</p>
                    <p className="font-bold text-text-main dark:text-white">{data.diagnosedDate}</p>
                  </div>
                </div>

                {data.diagnosingDoctor && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center size-10 rounded-full bg-sage-bg dark:bg-white/10 text-sage-medium dark:text-primary shrink-0">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted dark:text-gray-400">Diagnosing Doctor</p>
                      <p className="font-bold text-text-main dark:text-white">{data.diagnosingDoctor}</p>
                    </div>
                  </div>
                )}

              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-gray-300 dark:text-gray-600 mb-4 block">
              healing
            </span>
            <p className="text-gray-500 dark:text-gray-400">
              Condition details not found.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-soft-blue dark:text-primary font-semibold"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
