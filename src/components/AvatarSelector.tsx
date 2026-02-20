import React from "react";
import { AVATARS } from "@/data/gameData";
import { cn } from "@/lib/utils";

interface AvatarSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.id)}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-2xl border-4 transition-all duration-200 cursor-pointer hover:scale-110",
            selected === avatar.id
              ? "border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.2)] scale-110 shadow-lg"
              : "border-transparent bg-white/60 hover:border-[hsl(var(--primary)/0.4)]"
          )}
        >
          <span className="text-4xl">{avatar.emoji}</span>
          <span className="text-xs font-bold font-nunito text-foreground/70">{avatar.name}</span>
        </button>
      ))}
    </div>
  );
};
