"use client";

import type { TimelineEvent } from "@/lib/types";

const categoryStyles: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  cardiology: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    icon: "cardiology",
  },
  lab: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    icon: "bloodtype",
  },
  therapy: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    icon: "physical_therapy",
  },
  neurology: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    icon: "neurology",
  },
  medication: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    icon: "pill",
  },
  consultation: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
    icon: "stethoscope",
  },
};

interface TimelineCardProps {
  event: TimelineEvent;
  isRecent?: boolean;
}

export function TimelineCard({ event, isRecent = false }: TimelineCardProps) {
  const style = categoryStyles[event.category] || categoryStyles.consultation;
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative pl-6 group">
      <div
        className={`absolute left-[-5px] top-6 w-3 h-3 rounded-full border-2 ${
          isRecent
            ? "border-primary bg-background-light dark:bg-background-dark"
            : "border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark"
        } z-10`}
      ></div>
      <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-soft group-hover:shadow-soft-hover transition-all duration-300 border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`${style.bg} ${style.text} p-1.5 rounded-lg`}>
              <span className="material-symbols-outlined text-[20px] leading-none">
                {style.icon}
              </span>
            </span>
            <span className="text-xs font-semibold text-text-muted dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
          <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">
            more_horiz
          </span>
        </div>
        <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight mb-1.5">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {event.description}
        </p>

        {/* Attachments */}
        {event.attachments && event.attachments.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {event.attachments.map((attachment, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {attachment.type === "pdf" ? "description" : "image"}
                </span>
                {attachment.name}
              </span>
            ))}
          </div>
        )}

        {/* Image */}
        {event.imageUrl && (
          <div className="mt-3 relative h-24 w-full rounded-lg overflow-hidden">
            <img
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              src={event.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <p className="text-white text-xs font-medium">
                Session notes attached
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TimelineCardSkeleton() {
  return (
    <div className="relative pl-6">
      <div className="absolute left-[-5px] top-6 w-3 h-3 rounded-full border-2 border-gray-200 bg-background-light dark:bg-background-dark z-10"></div>
      <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="skeleton w-8 h-8 rounded-lg"></div>
            <div className="skeleton w-12 h-4 rounded"></div>
          </div>
        </div>
        <div className="skeleton h-6 w-48 rounded mb-2"></div>
        <div className="skeleton h-4 w-full rounded mb-1"></div>
        <div className="skeleton h-4 w-3/4 rounded"></div>
      </div>
    </div>
  );
}
