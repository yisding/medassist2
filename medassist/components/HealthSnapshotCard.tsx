"use client";

interface HealthSnapshotCardProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  value: number | string;
  unit: string;
  label: string;
  status: string;
  isLoading?: boolean;
}

export function HealthSnapshotCard({
  icon,
  iconBgColor,
  iconColor,
  value,
  unit,
  label,
  status,
  isLoading = false,
}: HealthSnapshotCardProps) {
  if (isLoading) {
    return (
      <div className="flex min-w-[160px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-card-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/10">
        <div className="flex justify-between items-start">
          <div className="skeleton p-2 rounded-xl w-10 h-10"></div>
          <div className="skeleton px-2 py-1 rounded-full w-16 h-6"></div>
        </div>
        <div>
          <div className="skeleton h-9 w-20 rounded mb-1"></div>
          <div className="skeleton h-4 w-16 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-card-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/10">
      <div className="flex justify-between items-start">
        <div className={`p-2 ${iconBgColor} rounded-xl ${iconColor}`}>
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <span className="px-2 py-1 rounded-full bg-sage-bg dark:bg-primary/20 text-sage-medium dark:text-primary text-xs font-bold">
          {status}
        </span>
      </div>
      <div>
        <p className="text-sage-dark dark:text-white text-3xl font-bold tracking-tight mb-1">
          {value}{" "}
          <span className="text-base font-medium text-text-muted">{unit}</span>
        </p>
        <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}
