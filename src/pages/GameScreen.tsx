import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { LetterTile } from "@/components/LetterTile";
import { LevelComplete } from "@/components/LevelComplete";
import { Confetti } from "@/components/Confetti";
import { LEVELS } from "@/data/gameData";
import { Volume2, ArrowLeft, Star, Lightbulb, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const GameScreen = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { player, session, isLoggedIn, startLevel, selectLetter, removeLetter, submitWord, nextWord, speakWord } = useGame();

  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [prevBadges, setPrevBadges] = useState<string[]>([]);

  const level = LEVELS.find((l) => l.id === Number(levelId));

  useEffect(() => {
    if (!isLoggedIn) { navigate("/"); return; }
    if (!levelId) { navigate("/map"); return; }
    startLevel(Number(levelId));
    setPrevBadges(player.badges);
  }, [levelId]);

  // Speak word when new word appears
  useEffect(() => {
    if (session?.currentWord && !session.showResult) {
      setTimeout(() => speakWord(session.currentWord.word), 500);
    }
  }, [session?.wordIndex]);

  // Handle result feedback
  useEffect(() => {
    if (session?.showResult) {
      if (session.lastResultCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setIsWiggling(true);
        setTimeout(() => setIsWiggling(false), 600);
        speakWord("Oops! Try again!");
      }
      setShowHint(false);
    }
  }, [session?.showResult, session?.lastResultCorrect]);

  const handleSubmit = useCallback(() => {
    if (!session || session.selectedLetters.length === 0) return;
    submitWord();
  }, [session, submitWord]);

  const handleNextWord = useCallback(() => {
    nextWord();
    setShowHint(false);
  }, [nextWord]);

  if (!level || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-fredoka text-2xl text-primary animate-pulse">Loading adventure... 🌟</div>
      </div>
    );
  }

  if (session.isComplete) {
    const newBadges = player.badges.filter((b) => !prevBadges.includes(b));
    return (
      <LevelComplete
        levelId={session.levelId}
        sessionPoints={session.sessionPoints}
        sessionCorrect={session.sessionCorrect}
        totalWords={LEVELS.find((l) => l.id === session.levelId)?.words.length || 10}
        newBadges={newBadges}
        onReplay={() => startLevel(Number(levelId))}
      />
    );
  }

  const word = session.currentWord;
  const totalWords = LEVELS.find((l) => l.id === session.levelId)?.words.length || 10;
  const progress = ((session.wordIndex) / totalWords) * 100;
  const typedWord = session.selectedLetters.map((l) => l.split("-")[0]).join("");

  return (
    <div className="min-h-screen flex flex-col p-4">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="max-w-2xl mx-auto w-full mb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/map")}
            className="game-card p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-nunito font-bold text-muted-foreground mb-1">
              <span>{level.emoji} {level.name}</span>
              <span>Word {session.wordIndex + 1}/{totalWords}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-shine transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="game-card px-3 py-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-fredoka text-lg text-primary">{session.sessionPoints}</span>
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-4">
        {/* Word picture card */}
        <div className="game-card p-6 text-center">
          <div
            className={cn("text-[120px] leading-none mb-4 transition-all", isWiggling && "wiggle")}
          >
            {word.emoji}
          </div>

          {/* Result feedback */}
          {session.showResult && (
            <div className={cn(
              "flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-fredoka text-xl mb-3 bounce-in",
              session.lastResultCorrect
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}>
              {session.lastResultCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>Amazing! +{5 + (session.attempts === 1 ? 2 : 0)} points! 🎉</span>
                </>
              ) : (
                <>
                  <span>Not quite! The word is: <strong className="uppercase">{word.word}</strong></span>
                </>
              )}
            </div>
          )}

          {/* Hint */}
          {showHint && !session.showResult && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl py-2 px-4 font-nunito text-sm text-yellow-800 mb-2 bounce-in">
              💡 Hint: {word.hint}
            </div>
          )}

          {/* Audio button */}
          <button
            onClick={() => speakWord(word.word)}
            className="inline-flex items-center gap-2 py-2 px-5 rounded-2xl font-fredoka text-lg text-primary-foreground hover:opacity-90 transition-all"
            style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 0 hsl(210 90% 35%)" }}
          >
            <Volume2 className="w-5 h-5" />
            Hear Word
          </button>
        </div>

        {/* Answer slots */}
        <div className="game-card p-5">
          <p className="font-fredoka text-sm text-muted-foreground text-center mb-3">Your answer:</p>
          <div className="flex justify-center gap-2 flex-wrap min-h-[64px] items-center">
            {word.word.split("").map((_, i) => {
              const letterId = session.selectedLetters[i];
              if (letterId) {
                const letter = letterId.split("-")[0];
                return (
                  <LetterTile
                    key={i}
                    letter={letter}
                    letterId={letterId}
                    onClick={!session.showResult ? removeLetter : () => {}}
                    variant={session.showResult ? (session.lastResultCorrect ? "correct" : "wrong") : "answer"}
                    index={i}
                  />
                );
              }
              return <LetterTile key={i} letter="" letterId={`empty-${i}`} onClick={() => {}} variant="empty" />;
            })}
          </div>
        </div>

        {/* Jumbled letters */}
        {!session.showResult && (
          <div className="game-card p-5">
            <p className="font-fredoka text-sm text-muted-foreground text-center mb-3">Tap letters to spell:</p>
            <div className="flex justify-center gap-2 flex-wrap min-h-[64px] items-center">
              {session.shuffledLetters.map((letterId, i) => {
                const letter = letterId.split("-")[0];
                return (
                  <LetterTile
                    key={letterId}
                    letter={letter}
                    letterId={letterId}
                    onClick={selectLetter}
                    variant="pool"
                    index={i}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {!session.showResult ? (
            <>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 py-3 px-5 rounded-2xl font-fredoka text-lg bg-yellow-400 text-yellow-900 hover:bg-yellow-300 transition-all shadow-md"
                style={{ boxShadow: "0 4px 0 hsl(43 80% 40%)" }}
              >
                <Lightbulb className="w-5 h-5" />
                Hint
              </button>
              <button
                onClick={handleSubmit}
                disabled={session.selectedLetters.length === 0}
                className="flex-1 py-3 rounded-2xl font-fredoka text-xl text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(210 90% 40%))", boxShadow: "0 4px 0 hsl(210 90% 30%)" }}
              >
                ✅ Check Spelling!
              </button>
            </>
          ) : (
            <button
              onClick={handleNextWord}
              className="flex-1 py-4 rounded-2xl font-fredoka text-xl text-primary-foreground hover:opacity-90 transition-all shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(142 68% 45%), hsl(142 68% 32%))", boxShadow: "0 4px 0 hsl(142 68% 25%)" }}
            >
              {session.wordIndex + 1 >= totalWords ? "🏆 Finish Level!" : "➡️ Next Word!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
