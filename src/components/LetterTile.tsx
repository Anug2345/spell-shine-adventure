import React from "react";
import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  letterId: string;
  onClick: (id: string) => void;
  variant?: "pool" | "answer" | "correct" | "wrong" | "empty";
  index?: number;
}

const TILE_COLORS = [
  "bg-[hsl(210_90%_54%)] text-white shadow-[0_4px_0_hsl(210_90%_35%)]",
  "bg-[hsl(25_95%_60%)] text-white shadow-[0_4px_0_hsl(25_95%_40%)]",
  "bg-[hsl(142_68%_45%)] text-white shadow-[0_4px_0_hsl(142_68%_28%)]",
  "bg-[hsl(270_70%_62%)] text-white shadow-[0_4px_0_hsl(270_70%_42%)]",
  "bg-[hsl(43_96%_56%)] text-[hsl(220_30%_20%)] shadow-[0_4px_0_hsl(43_96%_36%)]",
];

export const LetterTile: React.FC<LetterTileProps> = ({ letter, letterId, onClick, variant = "pool", index = 0 }) => {
  const colorClass = TILE_COLORS[index % TILE_COLORS.length];

  const variantStyles = {
    pool: cn("letter-tile w-14 h-14 text-2xl", colorClass, "hover:scale-110 hover:-translate-y-1"),
    answer: cn("letter-tile w-14 h-14 text-2xl", colorClass, "hover:scale-105"),
    correct: "letter-tile w-14 h-14 text-2xl bg-[hsl(142_68%_45%)] text-white shadow-[0_4px_0_hsl(142_68%_28%)] scale-110 bounce-in",
    wrong: "letter-tile w-14 h-14 text-2xl bg-[hsl(0_80%_58%)] text-white shadow-[0_4px_0_hsl(0_80%_38%)] wiggle",
    empty: "letter-tile w-14 h-14 text-2xl bg-white/50 border-4 border-dashed border-[hsl(var(--border))] cursor-default shadow-none",
  };

  if (variant === "empty") {
    return <div className={variantStyles.empty} />;
  }

  return (
    <button
      className={variantStyles[variant]}
      onClick={() => onClick(letterId)}
    >
      {letter.toUpperCase()}
    </button>
  );
};
