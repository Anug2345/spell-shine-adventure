import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LEVELS, BADGES, WordItem } from "@/data/gameData";

export interface PlayerData {
  name: string;
  avatar: string;
  totalPoints: number;
  correctWords: number;
  currentLevel: number;
  completedLevels: number[];
  badges: string[];
  wordHistory: { word: string; correct: boolean; attempts: number; levelId: number }[];
  consecutiveCorrect: number;
}

export interface GameSession {
  levelId: number;
  wordIndex: number;
  currentWord: WordItem;
  shuffledLetters: string[];
  selectedLetters: string[];
  attempts: number;
  sessionPoints: number;
  sessionCorrect: number;
  isComplete: boolean;
  showResult: boolean;
  lastResultCorrect: boolean | null;
}

interface GameContextType {
  player: PlayerData;
  session: GameSession | null;
  isLoggedIn: boolean;
  login: (name: string, avatar: string) => void;
  logout: () => void;
  startLevel: (levelId: number) => void;
  selectLetter: (letterId: string) => void;
  removeLetter: (letterId: string) => void;
  submitWord: () => void;
  nextWord: () => void;
  speakWord: (word: string) => void;
  resetGame: () => void;
  getAllPlayers: () => PlayerData[];
}

const DEFAULT_PLAYER: PlayerData = {
  name: "",
  avatar: "dragon",
  totalPoints: 0,
  correctWords: 0,
  currentLevel: 1,
  completedLevels: [],
  badges: [],
  wordHistory: [],
  consecutiveCorrect: 0,
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerData>(() => {
    try {
      const saved = localStorage.getItem("spelladventure_player");
      return saved ? JSON.parse(saved) : DEFAULT_PLAYER;
    } catch {
      return DEFAULT_PLAYER;
    }
  });

  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("spelladventure_player");
      const parsed = saved ? JSON.parse(saved) : null;
      return !!(parsed?.name);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (player.name) {
      localStorage.setItem("spelladventure_player", JSON.stringify(player));
    }
  }, [player]);

  const login = useCallback((name: string, avatar: string) => {
    try {
      const saved = localStorage.getItem("spelladventure_player");
      const existing = saved ? JSON.parse(saved) : null;
      const newPlayer = existing?.name === name
        ? { ...existing, avatar }
        : { ...DEFAULT_PLAYER, name, avatar };
      setPlayer(newPlayer);
      localStorage.setItem("spelladventure_player", JSON.stringify(newPlayer));
    } catch {
      const newPlayer = { ...DEFAULT_PLAYER, name, avatar };
      setPlayer(newPlayer);
      localStorage.setItem("spelladventure_player", JSON.stringify(newPlayer));
    }
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setSession(null);
  }, []);

  const startLevel = useCallback((levelId: number) => {
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level) return;
    const words = shuffleArray(level.words);
    const firstWord = words[0];
    const letters = shuffleArray(firstWord.word.split("").map((l, i) => `${l}-${i}`));
    localStorage.setItem("spelladventure_session_words", JSON.stringify(words));
    setSession({
      levelId,
      wordIndex: 0,
      currentWord: firstWord,
      shuffledLetters: letters,
      selectedLetters: [],
      attempts: 0,
      sessionPoints: 0,
      sessionCorrect: 0,
      isComplete: false,
      showResult: false,
      lastResultCorrect: null,
    });
  }, []);

  const selectLetter = useCallback((letterId: string) => {
    setSession((prev) => {
      if (!prev || prev.showResult) return prev;
      return {
        ...prev,
        shuffledLetters: prev.shuffledLetters.filter((l) => l !== letterId),
        selectedLetters: [...prev.selectedLetters, letterId],
      };
    });
  }, []);

  const removeLetter = useCallback((letterId: string) => {
    setSession((prev) => {
      if (!prev || prev.showResult) return prev;
      return {
        ...prev,
        selectedLetters: prev.selectedLetters.filter((l) => l !== letterId),
        shuffledLetters: [...prev.shuffledLetters, letterId],
      };
    });
  }, []);

  const submitWord = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const typed = prev.selectedLetters.map((l) => l.split("-")[0]).join("");
      const correct = typed.toLowerCase() === prev.currentWord.word.toLowerCase();
      const firstAttempt = prev.attempts === 0;
      const points = correct ? 5 + (firstAttempt ? 2 : 0) : 0;
      return {
        ...prev,
        attempts: prev.attempts + 1,
        showResult: true,
        lastResultCorrect: correct,
        sessionPoints: prev.sessionPoints + points,
        sessionCorrect: prev.sessionCorrect + (correct ? 1 : 0),
      };
    });
  }, []);

  const nextWord = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const savedWords = localStorage.getItem("spelladventure_session_words");
      const words: WordItem[] = savedWords ? JSON.parse(savedWords) : [];
      const nextIndex = prev.wordIndex + 1;

      const correct = prev.lastResultCorrect ?? false;

      // Update player history for the current word
      setPlayer((p) => {
        const newHistory = [...p.wordHistory, {
          word: prev.currentWord.word,
          correct,
          attempts: prev.attempts,
          levelId: prev.levelId,
        }];
        const newConsecutive = correct ? p.consecutiveCorrect + 1 : 0;
        return { ...p, wordHistory: newHistory, consecutiveCorrect: newConsecutive };
      });

      if (nextIndex >= words.length) {
        // Level complete — update player stats
        setPlayer((p) => {
          const newTotalPoints = p.totalPoints + prev.sessionPoints;
          const newCorrect = p.correctWords + prev.sessionCorrect;
          const newCompleted = p.completedLevels.includes(prev.levelId)
            ? p.completedLevels
            : [...p.completedLevels, prev.levelId];
          const newConsecutive = correct ? p.consecutiveCorrect + 1 : 0;

          const newBadges = [...p.badges];
          BADGES.forEach((badge) => {
            if (newBadges.includes(badge.id)) return;
            if (badge.id === "word_explorer" && newCompleted.length >= 1) newBadges.push(badge.id);
            if (badge.id === "spelling_star" && newCorrect >= 10) newBadges.push(badge.id);
            if (badge.id === "sentence_master" && newTotalPoints >= 100) newBadges.push(badge.id);
            if (badge.id === "speed_reader" && newConsecutive >= 3) newBadges.push(badge.id);
            if (badge.id === "champion" && newCompleted.length >= 4) newBadges.push(badge.id);
          });

          return {
            ...p,
            totalPoints: newTotalPoints,
            correctWords: newCorrect,
            completedLevels: newCompleted,
            badges: newBadges,
            consecutiveCorrect: newConsecutive,
            currentLevel: Math.min(LEVELS.length, Math.max(p.currentLevel, prev.levelId + 1)),
          };
        });

        return { ...prev, isComplete: true, showResult: false };
      }

      const nextWordItem = words[nextIndex];
      const letters = shuffleArray(nextWordItem.word.split("").map((l, i) => `${l}-${i}`));

      return {
        ...prev,
        wordIndex: nextIndex,
        currentWord: nextWordItem,
        shuffledLetters: letters,
        selectedLetters: [],
        attempts: 0,
        showResult: false,
        lastResultCorrect: null,
      };
    });
  }, []);

  const speakWord = useCallback((word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem("spelladventure_player");
    localStorage.removeItem("spelladventure_session_words");
    setPlayer(DEFAULT_PLAYER);
    setSession(null);
    setIsLoggedIn(false);
  }, []);

  const getAllPlayers = useCallback((): PlayerData[] => {
    return player.name ? [player] : [];
  }, [player]);

  return (
    <GameContext.Provider value={{
      player, session, isLoggedIn,
      login, logout, startLevel,
      selectLetter, removeLetter, submitWord, nextWord,
      speakWord, resetGame, getAllPlayers,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
