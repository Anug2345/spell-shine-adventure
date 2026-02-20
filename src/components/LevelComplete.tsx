import React from "react";
import { useNavigate } from "react-router-dom";
import { LEVELS } from "@/data/gameData";
import { Confetti } from "@/components/Confetti";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { Star, Trophy, Home, RotateCcw } from "lucide-react";
import { useGame } from "@/hooks/useGame";

interface LevelCompleteProps {
  levelId: number;
  sessionPoints: number;
  sessionCorrect: number;
  totalWords: number;
  newBadges: string[];
  onReplay: () => void;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({
  levelId,
  sessionPoints,
  sessionCorrect,
  totalWords,
  newBadges,
  onReplay,
}) => {
  const navigate = useNavigate();
  const { player } = useGame();
  const level = LEVELS.find((l) => l.id === levelId);
  const accuracy = Math.round((sessionCorrect / totalWords) * 100);
  const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Confetti active={true} />
      <div className="game-card max-w-md w-full p-8 text-center animate-[bounceIn_0.5s_ease-out]">
        <div className="text-6xl mb-3 float">🎉</div>
        <h2 className="font-fredoka text-3xl text-primary mb-1">Level Complete!</h2>
        <p className="text-muted-foreground font-nunito mb-6">{level?.name} conquered!</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-12 h-12 transition-all duration-500 star-pop`}
              style={{ animationDelay: `${s * 0.2}s`, color: s <= stars ? "hsl(43 96% 56%)" : "hsl(var(--border))", fill: s <= stars ? "hsl(43 96% 56%)" : "transparent" }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary/10 rounded-2xl p-4">
            <div className="font-fredoka text-3xl text-primary">+{sessionPoints}</div>
            <div className="text-xs text-muted-foreground font-nunito font-bold">Points Earned</div>
          </div>
          <div className="bg-[hsl(142_68%_45%/0.15)] rounded-2xl p-4">
            <div className="font-fredoka text-3xl text-[hsl(142_68%_40%)]">{sessionCorrect}/{totalWords}</div>
            <div className="text-xs text-muted-foreground font-nunito font-bold">Words Correct</div>
          </div>
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mb-6">
            <p className="font-fredoka text-lg text-accent mb-2">🏅 New Badges!</p>
            <BadgeDisplay earnedBadges={newBadges} size="sm" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/map")}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-muted font-fredoka text-foreground hover:bg-muted/80 transition-all"
          >
            <Home className="w-4 h-4" />
            Map
          </button>
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-fredoka hover:opacity-90 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
