"use client";

interface ConditionCardProps {
  name: string;
  diagnosedDate?: string;
  imageUrl?: string;
  icon?: string;
  isResolved?: boolean;
  isLoading?: boolean;
}

export function ConditionCard({
  name,
  diagnosedDate,
  imageUrl,
  icon,
  isResolved = false,
  isLoading = false,
}: ConditionCardProps) {
  if (isLoading) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/10">
        <div className="flex items-start gap-4">
          <div className="skeleton rounded-xl w-24 h-24 shrink-0"></div>
          <div className="flex flex-col flex-1 h-full justify-between gap-3">
            <div>
              <div className="skeleton h-5 w-32 rounded mb-2"></div>
              <div className="skeleton h-4 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isResolved) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-card-dark/50 p-4 border border-gray-200 dark:border-white/10 transition-all">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center rounded-xl w-24 h-24 shrink-0 bg-gray-200 dark:bg-white/10 text-gray-400">
            <span className="material-symbols-outlined text-[40px]">
              {icon || "grain"}
            </span>
          </div>
          <div className="flex flex-col flex-1 h-full justify-between gap-3">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="text-gray-600 dark:text-gray-300 text-base font-bold leading-tight">
                  {name}
                </h4>
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">
                  check_circle
                </span>
              </div>
              {diagnosedDate && (
                <p className="text-gray-400 text-sm mt-1">Diagnosed {diagnosedDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-white/10 transition-all">
      <div className="flex items-start gap-4">
        {imageUrl ? (
          <div
            className="bg-center bg-no-repeat bg-cover rounded-xl w-24 h-24 shrink-0 shadow-sm"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <div className="flex items-center justify-center rounded-xl w-24 h-24 shrink-0 bg-sage-bg dark:bg-white/10 text-sage-medium dark:text-primary">
            <span className="material-symbols-outlined text-[40px]">
              {icon || "healing"}
            </span>
          </div>
        )}
        <div className="flex flex-col flex-1 h-full justify-between gap-3">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-sage-dark dark:text-white text-base font-bold leading-tight">
                {name}
              </h4>
            </div>
            {diagnosedDate && (
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Diagnosed {diagnosedDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
