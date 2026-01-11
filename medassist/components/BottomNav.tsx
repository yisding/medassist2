"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/timeline", icon: "history", label: "Timeline" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-safe pt-2 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 group transition-colors ${
                isActive
                  ? "text-text-main dark:text-primary"
                  : "text-gray-400 hover:text-primary transition-colors"
              }`}
            >
              <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span
                className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Floating Add Button */}
        <div className="relative -top-6">
          <button className="flex items-center justify-center size-14 rounded-full bg-sage-dark dark:bg-primary text-white dark:text-background-dark shadow-lg shadow-sage-dark/30 hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      </div>
      <div className="h-6 w-full"></div>
    </nav>
  );
}
