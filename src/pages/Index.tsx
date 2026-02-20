import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { AvatarSelector } from "@/components/AvatarSelector";
import { AVATARS } from "@/data/gameData";
import heroImage from "@/assets/hero-banner.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { login, player, isLoggedIn } = useGame();
  const [name, setName] = useState(player.name || "");
  const [avatar, setAvatar] = useState(player.avatar || "dragon");
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const handleStart = () => {
    if (!name.trim()) {
      setError("Please enter your name! 😊");
      return;
    }
    if (name.trim().length < 2) {
      setError("Name must be at least 2 letters!");
      return;
    }
    setError("");
    login(name.trim(), avatar);
    navigate("/map");
  };

  const handleTeacherLogin = () => {
    navigate("/dashboard");
  };

  const selectedAvatarEmoji = AVATARS.find((a) => a.id === avatar)?.emoji || "🐉";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background letters */}
      {["A", "B", "C", "D", "E", "Z"].map((letter, i) => (
        <div
          key={letter}
          className="absolute font-fredoka text-primary/10 pointer-events-none select-none float"
          style={{
            fontSize: `${80 + i * 20}px`,
            left: `${i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {letter}
        </div>
      ))}

      <div className="w-full max-w-lg relative z-10">
        {/* Hero image */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 border-white">
          <img src={heroImage} alt="Spell & Shine Adventure" className="w-full object-cover" />
        </div>

        {/* Login card */}
        <div className="game-card p-8">
          {!isTeacher ? (
            <>
              <h1 className="font-fredoka text-3xl text-center text-primary mb-1">
                Welcome, Young Adventurer!
              </h1>
              <p className="text-center text-muted-foreground font-nunito mb-6 text-sm">
                Enter your name and pick your hero to begin!
              </p>

              {/* Name input */}
              <div className="mb-5">
                <label className="font-fredoka text-lg text-foreground block mb-2">
                  Your Name
                </label>
                <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-primary transition-all">
                  <span className="text-2xl">{selectedAvatarEmoji}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    placeholder="Type your name here..."
                    maxLength={20}
                    className="flex-1 bg-transparent outline-none font-nunito text-lg font-semibold text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                {error && (
                  <p className="text-destructive text-sm mt-2 font-nunito font-bold">{error}</p>
                )}
              </div>

              {/* Avatar selection */}
              <div className="mb-6">
                <label className="font-fredoka text-lg text-foreground block mb-3">
                  Choose Your Hero
                </label>
                <AvatarSelector selected={avatar} onSelect={setAvatar} />
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-2xl font-fredoka text-2xl text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(210 90% 40%))", boxShadow: "0 6px 0 hsl(210 90% 30%)" }}
              >
                🚀 Start Adventure!
              </button>

              <button
                onClick={() => setIsTeacher(true)}
                className="w-full mt-3 py-2 rounded-xl font-nunito text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                🎓 Teacher Login
              </button>
            </>
          ) : (
            <>
              <h2 className="font-fredoka text-2xl text-center text-primary mb-6">Teacher Dashboard</h2>
              <button
                onClick={handleTeacherLogin}
                className="w-full py-4 rounded-2xl font-fredoka text-xl text-primary-foreground hover:opacity-90 transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(270 70% 55%), hsl(270 70% 40%))", boxShadow: "0 4px 0 hsl(270 70% 30%)" }}
              >
                📊 Open Dashboard
              </button>
              <button
                onClick={() => setIsTeacher(false)}
                className="w-full mt-3 py-2 text-muted-foreground font-nunito text-sm hover:text-foreground"
              >
                ← Back to Student Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
