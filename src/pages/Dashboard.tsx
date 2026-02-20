import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { LEVELS, BADGES } from "@/data/gameData";
import { ArrowLeft, Download, Users, Trophy, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample demo pupils for the dashboard
const DEMO_PUPILS = [
  { name: "Alice", avatar: "cat", totalPoints: 87, correctWords: 14, completedLevels: [1, 2], badges: ["word_explorer", "spelling_star"], wordHistory: [
    { word: "cat", correct: true, attempts: 1, levelId: 1 },
    { word: "sun", correct: true, attempts: 1, levelId: 1 },
    { word: "fish", correct: false, attempts: 2, levelId: 2 },
    { word: "tree", correct: true, attempts: 1, levelId: 2 },
  ]},
  { name: "Ben", avatar: "robot", totalPoints: 42, correctWords: 7, completedLevels: [1], badges: ["word_explorer"], wordHistory: [
    { word: "cat", correct: true, attempts: 2, levelId: 1 },
    { word: "dog", correct: false, attempts: 3, levelId: 1 },
    { word: "pen", correct: true, attempts: 1, levelId: 1 },
  ]},
  { name: "Chloe", avatar: "fox", totalPoints: 130, correctWords: 21, completedLevels: [1, 2, 3], badges: ["word_explorer", "spelling_star", "sentence_master"], wordHistory: [
    { word: "apple", correct: true, attempts: 1, levelId: 3 },
    { word: "chair", correct: true, attempts: 1, levelId: 3 },
    { word: "house", correct: false, attempts: 2, levelId: 3 },
  ]},
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { player } = useGame();
  const [selectedPupil, setSelectedPupil] = useState<string | null>(null);

  // Merge real player with demo pupils
  const allPupils = [
    ...(player.name ? [player] : []),
    ...DEMO_PUPILS.filter((d) => d.name !== player.name),
  ];

  const selected = allPupils.find((p) => p.name === selectedPupil);

  const getAccuracy = (history: { correct: boolean }[]) => {
    if (!history.length) return 0;
    return Math.round((history.filter((h) => h.correct).length / history.length) * 100);
  };

  const getWordsByLevel = (history: { word: string; correct: boolean; levelId: number }[], levelId: number) => {
    return history.filter((h) => h.levelId === levelId);
  };

  return (
    <div className="min-h-screen p-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="game-card p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-fredoka text-3xl text-primary">Teacher Dashboard</h1>
            <p className="text-muted-foreground font-nunito text-sm">Monitor pupil progress and performance</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="game-card p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="font-fredoka text-2xl text-primary">{allPupils.length}</div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Pupils</div>
          </div>
          <div className="game-card p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <div className="font-fredoka text-2xl text-yellow-600">
              {Math.round(allPupils.reduce((a, p) => a + p.totalPoints, 0) / (allPupils.length || 1))}
            </div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Avg Points</div>
          </div>
          <div className="game-card p-4 text-center">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <div className="font-fredoka text-2xl text-green-600">
              {Math.round(allPupils.reduce((a, p) => a + getAccuracy(p.wordHistory), 0) / (allPupils.length || 1))}%
            </div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Avg Accuracy</div>
          </div>
          <div className="game-card p-4 text-center">
            <Clock className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <div className="font-fredoka text-2xl text-purple-600">
              {allPupils.reduce((a, p) => a + p.completedLevels.length, 0)}
            </div>
            <div className="text-xs font-nunito font-bold text-muted-foreground">Levels Done</div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {/* Pupil list */}
          <div className="md:col-span-2 game-card p-4">
            <h2 className="font-fredoka text-xl text-primary mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" /> Pupils
            </h2>
            <div className="space-y-2">
              {allPupils.map((pupil) => {
                const accuracy = getAccuracy(pupil.wordHistory);
                return (
                  <button
                    key={pupil.name}
                    onClick={() => setSelectedPupil(pupil.name === selectedPupil ? null : pupil.name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left",
                      selectedPupil === pupil.name ? "bg-primary/15 border-2 border-primary" : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                      {pupil.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-fredoka text-base leading-tight">{pupil.name}</div>
                      <div className="flex gap-2 text-xs text-muted-foreground font-nunito">
                        <span>⭐ {pupil.totalPoints}pts</span>
                        <span>🎯 {accuracy}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {LEVELS.map((level) => (
                        <div
                          key={level.id}
                          className={cn(
                            "w-5 h-5 rounded-full text-[10px] flex items-center justify-center",
                            pupil.completedLevels.includes(level.id) ? "bg-green-400 text-white" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {level.id}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="md:col-span-3 game-card p-4">
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-fredoka text-xl text-primary">{selected.name}'s Report</h2>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-nunito font-bold py-1 px-3 rounded-xl bg-muted">
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-primary/10 rounded-2xl p-3 text-center">
                    <div className="font-fredoka text-2xl text-primary">{selected.totalPoints}</div>
                    <div className="text-[10px] font-nunito font-bold text-muted-foreground">Points</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-3 text-center">
                    <div className="font-fredoka text-2xl text-green-600">{getAccuracy(selected.wordHistory)}%</div>
                    <div className="text-[10px] font-nunito font-bold text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="bg-yellow-50 rounded-2xl p-3 text-center">
                    <div className="font-fredoka text-2xl text-yellow-600">{selected.badges.length}</div>
                    <div className="text-[10px] font-nunito font-bold text-muted-foreground">Badges</div>
                  </div>
                </div>

                {/* Badges */}
                {selected.badges.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-fredoka text-sm text-muted-foreground mb-2">Badges Earned</h3>
                    <div className="flex gap-2 flex-wrap">
                      {BADGES.filter((b) => selected.badges.includes(b.id)).map((b) => (
                        <div key={b.id} className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-xl px-2 py-1">
                          <span>{b.emoji}</span>
                          <span className="text-xs font-nunito font-bold">{b.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Word history by level */}
                <h3 className="font-fredoka text-sm text-muted-foreground mb-2">Word Performance</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {LEVELS.filter((l) => getWordsByLevel(selected.wordHistory, l.id).length > 0).map((level) => {
                    const words = getWordsByLevel(selected.wordHistory, level.id);
                    return (
                      <div key={level.id} className="bg-muted/40 rounded-2xl p-3">
                        <div className="font-fredoka text-sm mb-2">{level.emoji} {level.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {words.map((w, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-xs font-nunito font-bold px-2 py-1 rounded-lg uppercase",
                                w.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                              )}
                            >
                              {w.correct ? "✓" : "✗"} {w.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {selected.wordHistory.length === 0 && (
                    <p className="text-muted-foreground text-sm font-nunito text-center py-4">No words attempted yet.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <span className="text-5xl mb-3">👆</span>
                <p className="font-fredoka text-lg text-muted-foreground">Select a pupil to see their detailed report</p>
              </div>
            )}
          </div>
        </div>

        {/* Level overview */}
        <div className="game-card p-5 mt-4">
          <h2 className="font-fredoka text-xl text-primary mb-4">Level Completion Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LEVELS.map((level) => {
              const completedCount = allPupils.filter((p) => p.completedLevels.includes(level.id)).length;
              const pct = allPupils.length ? Math.round((completedCount / allPupils.length) * 100) : 0;
              return (
                <div key={level.id} className="bg-muted/40 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-1">{level.emoji}</div>
                  <div className="font-fredoka text-sm mb-2">{level.name}</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs font-nunito font-bold text-muted-foreground">{completedCount}/{allPupils.length} pupils</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
