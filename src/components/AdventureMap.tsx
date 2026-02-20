import React from "react";
import { LEVELS } from "@/data/gameData";
import { Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdventureMapProps {
  completedLevels: number[];
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
}

const LEVEL_POSITIONS = [
  { x: "10%", y: "70%" },
  { x: "35%", y: "40%" },
  { x: "62%", y: "60%" },
  { x: "82%", y: "25%" },
];

export const AdventureMap: React.FC<AdventureMapProps> = ({ completedLevels, currentLevel, onSelectLevel }) => {
  const isUnlocked = (levelId: number) => levelId === 1 || completedLevels.includes(levelId - 1);
  const isCompleted = (levelId: number) => completedLevels.includes(levelId);

  return (
    <div
      className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
      style={{ background: "linear-gradient(135deg, hsl(142 50% 35%) 0%, hsl(195 60% 55%) 40%, hsl(270 40% 45%) 70%, hsl(240 60% 20%) 100%)" }}
    >
      {/* Clouds */}
      {[10, 45, 75].map((x, i) => (
        <div key={i} className="absolute text-4xl opacity-80 float" style={{ left: `${x}%`, top: `${8 + i * 5}%`, animationDelay: `${i * 0.8}s` }}>
          ☁️
        </div>
      ))}

      {/* Dashed path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 440" preserveAspectRatio="none">
        <path
          d="M 100 308 Q 200 250 350 176 Q 500 100 620 264 Q 720 380 820 110"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="18"
          strokeDasharray="30 15"
          strokeLinecap="round"
        />
      </svg>

      {LEVELS.map((level, i) => {
        const unlocked = isUnlocked(level.id);
        const completed = isCompleted(level.id);
        const isCurrent = level.id === currentLevel && !completed;
        const pos = LEVEL_POSITIONS[i];

        return (
          <div
            key={level.id}
            className="absolute flex flex-col items-center"
            style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
          >
            <button
              onClick={() => unlocked && onSelectLevel(level.id)}
              disabled={!unlocked}
              className={cn(
                "relative w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-200 text-3xl",
                completed && "border-yellow-400 bg-yellow-400 glow-pulse",
                isCurrent && "border-white bg-white/90 hover:scale-110 cursor-pointer",
                !completed && !isCurrent && unlocked && "border-white bg-white/70 hover:scale-110 cursor-pointer",
                !unlocked && "border-gray-400 bg-gray-600/60 cursor-not-allowed opacity-60"
              )}
            >
              {completed ? <span>⭐</span> : unlocked ? <span>{level.emoji}</span> : <Lock className="w-6 h-6 text-gray-300" />}
              {isCurrent && (
                <span className="absolute -top-2 -right-2">
                  <Play className="w-5 h-5 text-orange-500 fill-orange-500" />
                </span>
              )}
            </button>

            <div className={cn(
              "mt-2 px-3 py-1 rounded-full text-center font-fredoka text-xs shadow-md",
              unlocked ? "bg-white/90 text-foreground" : "bg-black/30 text-white/70"
            )}>
              <div className="font-bold text-sm leading-tight">{level.name}</div>
              <div className="text-[10px] opacity-70">{level.description}</div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-3 left-4 text-yellow-300 text-xl">✨</div>
      <div className="absolute bottom-3 right-4 text-yellow-300 text-xl">✨</div>
      <div className="absolute bottom-3 left-1/2 text-yellow-300 text-xl">⭐</div>
    </div>
  );
};
