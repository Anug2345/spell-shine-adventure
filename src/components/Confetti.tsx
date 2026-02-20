import React, { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
}

const COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
const SHAPES = ["●", "★", "♦", "▲"];

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; shape: string; duration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 0.8,
        size: 12 + Math.random() * 16,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            color: piece.color,
            fontSize: `${piece.size}px`,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {piece.shape}
        </span>
      ))}
    </div>
  );
};
