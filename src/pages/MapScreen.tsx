import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { AdventureMap } from "@/components/AdventureMap";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { AVATARS } from "@/data/gameData";
import { LogOut, Trophy, Zap } from "lucide-react";

const MapScreen = () => {
  const navigate = useNavigate();
  const { player, logout, isLoggedIn } = useGame();

  React.useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const avatarEmoji = AVATARS.find((a) => a.id === player.avatar)?.emoji || "🐉";

  const handleSelectLevel = (levelId: number) => {
    navigate(`/game/${levelId}`);
  };

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Top bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 game-card px-4 py-2">
            <span className="text-3xl">{avatarEmoji}</span>
            <div>
              <div className="font-fredoka text-lg text-foreground leading-none">{player.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-nunito font-bold">
                <Zap className="w-3 h-3 text-yellow-500" />
                {player.totalPoints} pts
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="game-card px-4 py-2 font-fredoka text-sm text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="game-card px-4 py-2 font-fredoka text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-fredoka text-4xl text-primary">Adventure Map</h1>
          <p className="text-muted-foreground font-nunito">Choose your next challenge!</p>
        </div>

        {/* Map */}
        <AdventureMap
          completedLevels={player.completedLevels}
          currentLevel={player.currentLevel}
          onSelectLevel={handleSelectLevel}
        />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="game-card p-4 text-center">
            <div className="font-fredoka text-3xl text-primary">{player.totalPoints}</div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Total Points</div>
          </div>
          <div className="game-card p-4 text-center">
            <div className="font-fredoka text-3xl text-[hsl(142_68%_45%)]">{player.correctWords}</div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Words Correct</div>
          </div>
          <div className="game-card p-4 text-center">
            <div className="font-fredoka text-3xl text-[hsl(var(--secondary))]">{player.badges.length}</div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Badges</div>
          </div>
        </div>

        {/* Badges */}
        {player.badges.length > 0 && (
          <div className="game-card p-6 mt-4">
            <h3 className="font-fredoka text-xl text-center text-primary mb-4">🏅 My Badges</h3>
            <BadgeDisplay earnedBadges={player.badges} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapScreen;
