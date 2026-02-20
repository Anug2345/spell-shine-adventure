import { useState, useEffect, useCallback } from "react";
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

export function useGame() {
  const [player, setPlayer] = useState<PlayerData>(() => {
    const saved = localStorage.getItem("spelladventure_player");
    return saved ? JSON.parse(saved) : DEFAULT_PLAYER;
  });

  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("spelladventure_player") && !!JSON.parse(localStorage.getItem("spelladventure_player") || "{}").name);

  useEffect(() => {
    if (player.name) {
      localStorage.setItem("spelladventure_player", JSON.stringify(player));
    }
  }, [player]);

  const login = useCallback((name: string, avatar: string) => {
    const saved = localStorage.getItem("spelladventure_player");
    const existing = saved ? JSON.parse(saved) : null;
    if (existing?.name === name) {
      setPlayer({ ...existing, avatar });
    } else {
      setPlayer({ ...DEFAULT_PLAYER, name, avatar });
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
    // Store shuffled words in a ref-like way
    localStorage.setItem("spelladventure_session_words", JSON.stringify(words));
  }, []);

  const selectLetter = useCallback((letterId: string) => {
    setSession((prev) => {
      if (!prev || prev.showResult) return prev;
      const letter = letterId.split("-")[0];
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
      let points = 0;
      if (correct) {
        points = 5 + (firstAttempt ? 2 : 0);
      }
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

      // Check if level complete
      if (nextIndex >= words.length) {
        // Update player
        setPlayer((p) => {
          const typed = prev.selectedLetters.map((l) => l.split("-")[0]).join("");
          const correct = prev.lastResultCorrect ?? false;
          const newHistory = [...p.wordHistory, { word: prev.currentWord.word, correct, attempts: prev.attempts, levelId: prev.levelId }];
          const newTotalPoints = p.totalPoints + prev.sessionPoints;
          const newCorrect = p.correctWords + prev.sessionCorrect;
          const newCompleted = p.completedLevels.includes(prev.levelId) ? p.completedLevels : [...p.completedLevels, prev.levelId];
          const newConsecutive = correct ? p.consecutiveCorrect + 1 : 0;

          // Check badges
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
            wordHistory: newHistory,
            consecutiveCorrect: newConsecutive,
            currentLevel: Math.min(LEVELS.length, Math.max(p.currentLevel, prev.levelId + 1)),
          };
        });

        return { ...prev, isComplete: true, showResult: false };
      }

      const nextWordItem = words[nextIndex];
      const letters = shuffleArray(nextWordItem.word.split("").map((l, i) => `${l}-${i}`));

      // Also update player history for current word
      setPlayer((p) => {
        const correct = prev.lastResultCorrect ?? false;
        const newHistory = [...p.wordHistory, { word: prev.currentWord.word, correct, attempts: prev.attempts, levelId: prev.levelId }];
        const newTotalPoints = p.totalPoints + (prev.lastResultCorrect ? (prev.attempts === 0 ? 7 : 5) : 0);
        return { ...p, wordHistory: newHistory, totalPoints: newTotalPoints };
      });

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

  // All players for teacher dashboard
  const getAllPlayers = useCallback((): PlayerData[] => {
    const players: PlayerData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("spelladventure_player")) {
        try {
          const p = JSON.parse(localStorage.getItem(key) || "");
          if (p.name) players.push(p);
        } catch {}
      }
    }
    // Always include current player
    if (player.name && !players.find((p) => p.name === player.name)) {
      players.push(player);
    }
    return players;
  }, [player]);

  return {
    player,
    session,
    isLoggedIn,
    login,
    logout,
    startLevel,
    selectLetter,
    removeLetter,
    submitWord,
    nextWord,
    speakWord,
    resetGame,
    getAllPlayers,
  };
}
