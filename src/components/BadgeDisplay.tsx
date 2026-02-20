import React from "react";
import { BADGES } from "@/data/gameData";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  earnedBadges: string[];
  size?: "sm" | "lg";
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ earnedBadges, size = "lg" }) => {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", size === "sm" ? "gap-1" : "gap-3")}>
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            title={`${badge.name}: ${badge.description}`}
            className={cn(
              "flex flex-col items-center rounded-2xl border-2 transition-all",
              size === "sm" ? "p-2 min-w-[60px]" : "p-3 min-w-[80px]",
              earned
                ? "border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.15)] shadow-md star-pop"
                : "border-[hsl(var(--border))] bg-white/30 opacity-40 grayscale"
            )}
          >
            <span className={size === "sm" ? "text-2xl" : "text-4xl"}>{badge.emoji}</span>
            <span className={cn("font-bold text-center font-nunito", size === "sm" ? "text-[9px] mt-1" : "text-[10px] mt-1")}>
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
