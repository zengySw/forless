"use client";

import { useState, useEffect } from "react";
import { get_list } from "@/lib/content";
import type { Letter, Secret, Achievement, Settings } from "@/lib/types";

export default function ExplorePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<"letters" | "secrets" | "achievements" | "memories">("letters");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [lettersRaw, secretsRaw, achievementsRaw] = await Promise.all([
        get_list("letters"),
        get_list("secrets"),
        get_list("achievements"),
      ]);
      setLetters(lettersRaw as Letter[]);
      setSecrets(secretsRaw as Secret[]);
      setAchievements(achievementsRaw as Achievement[]);
    };
    loadData();
  }, []);

  const tabs = [
    { id: "letters", label: "💌 Письма", count: letters.length },
    { id: "secrets", label: "🔐 Секреты", count: secrets.length },
    { id: "achievements", label: "🏆 Достижения", count: achievements.length },
    { id: "memories", label: "🕰️ Воспоминания", count: 0 },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      <header className="p-6 mb-8 border-b">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card)] rounded hover:bg-[var(--soft)] transition-colors mb-4"
        >
          ← Назад
        </button>
        <h1 className="text-2xl font-bold">Исследование 🔍</h1>
        <p className="text-opacity-80">Открой для себя весь контент</p>
      </header>

      {/* Tab navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--pink)] text-white"
                : "bg-[var(--card)] hover:bg-[var(--soft)]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "letters" && (
          <div className="grid grid-cols-1 gap-6">
            {letters.map((letter: any) => (
              <div key={letter.id} className="p-6 bg-[var(--card)] rounded-xl border-l-4 border-[var(--pink)] transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{letter.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{letter.condition}</h3>
                    <p className="text-sm opacity-80 line-clamp-3">{letter.text}</p>
                  </div>
                </div>
                {!letter.opened && (
                  <button 
                    className="mt-4 inline-block px-4 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm"
                  >
                    Открыть
                  </button>
                )}
                {letter.opened && (
                  <p className="mt-4 text-sm opacity-80">✨ Открыто</p>
                )}
              </div>
            ))}
            {letters.length === 0 && <p className="text-center opacity-60 py-12">Письма появятся здесь</p>}
          </div>
        )}

        {activeTab === "secrets" && (
          <div className="grid grid-cols-1 gap-6">
            {secrets.map((secret: any) => (
              <div key={secret.id} className="p-6 bg-[var(--card)] rounded-xl border-l-4 border-[var(--pink)] transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔐</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{secret.title}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{secret.description}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm opacity-60">Подсказка: {secret.hint || "Нет подсказки"}</p>
              </div>
            ))}
            {secrets.length === 0 && <p className="text-center opacity-60 py-12">Секреты появятся здесь</p>}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 gap-6">
            {achievements.map((achievement: any) => (
              <div key={achievement.id} className="p-6 bg-[var(--card)] rounded-xl border-l-4 border-[var(--pink)] transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.icon || "🏆"}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{achievement.title}</h3>
                    <p className="text-sm opacity-80">{achievement.description}</p>
                    <p className="text-xs opacity-60 mt-2">Категория: {achievement.category} | Цель: {achievement.target}</p>
                  </div>
                </div>
                {!achievement.unlocked && (
                  <p className="mt-4 text-sm opacity-60">🔒 Заблокировано</p>
                )}
                {achievement.unlocked && (
                  <p className="mt-4 text-sm" style={{ color: "#ff5c8a" }}>✨ Разблокировано</p>
                )}
              </div>
            ))}
            {achievements.length === 0 && <p className="text-center opacity-60 py-12">Достижения появятся здесь</p>}
          </div>
        )}

        {activeTab === "memories" && (
          <div className="text-center py-12 opacity-60">
            <p className="text-xl mb-2">🕰️</p>
            <p>Воспоминания доступны на отдельной странице</p>
            <button 
              onClick={() => window.location.href = "/memories"}
              className="mt-4 inline-block px-6 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors"
            >
              Открыть воспоминания
            </button>
          </div>
        )}
      </div>

      {/* Sound toggle */}
      <div className="fixed top-6 left-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-5 h-5 accent-[var(--pink)]"
          />
          <span>🔊 {soundEnabled ? "Вкл" : "Выкл"}</span>
        </label>
      </div>
    </main>
  )
}