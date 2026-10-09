"use client";

import { useState, useEffect } from "react";
import { get_list, get_single } from "@/lib/content";
import type { Letter, Settings } from "@/lib/types";

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [lettersRaw, settingsRaw] = await Promise.all([
        get_list("letters"),
        get_single("settings"),
      ]);
      setLetters(lettersRaw as Letter[]);
      setSettings(settingsRaw as Settings);
    };
    loadData();
  }, []);

  const handleLetterOpen = (letter: Letter) => {
    setSelectedLetter(letter);
    setShowModal(true);
    // Play opening sound if enabled
    if (soundEnabled) {
      // Would play soft sound
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLetter(null);
  };

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      {/* Header */}
      <header className="p-6 mb-8 border-b">
        <h1 className="text-2xl font-bold">💌 Письма "Открой, когда…"</h1>
        <p className="text-opacity-80">Все твои конверты</p>
      </header>

      {/* Stats */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--card)] rounded-xl text-center">
            <div className="text-2xl font-bold" style={{ color: "#ff5c8a" }}>{letters.length}</div>
            <div className="text-sm opacity-80">всего писем</div>
          </div>
          <div className="p-4 bg-[var(--card)] rounded-xl text-center">
            <div className="text-2xl font-bold" style={{ color: "#ff5c8a" }}>
              {letters.filter((l: any) => l.opened).length}
            </div>
            <div className="text-sm opacity-80">открыто</div>
          </div>
        </div>
      </div>

      {/* Letters list */}
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {letters.map((letter: any) => (
          <div 
            key={letter.id}
            className="p-6 bg-[var(--card)] rounded-xl border-l-4 border-[var(--pink)] transition-colors hover:bg-[var(--soft)]"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{letter.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg">{letter.condition}</h3>
                <p className="text-sm opacity-80 line-clamp-3">{letter.text}</p>
              </div>
            </div>
            
            {/* Unlock info */}
            {!letter.opened && (
              <div className="mt-4 pt-4 border-t border-opacity-20">
                <p className="text-sm opacity-60">Условие: {letter.condition}</p>
                <button 
                  onClick={() => handleLetterOpen(letter)}
                  className="mt-2 inline-block px-4 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
                >
                  Открыть сейчас
                </button>
              </div>
            )}
            {letter.opened && (
              <p className="mt-2 text-sm opacity-80">✨ Открыто</p>
            )}
          </div>
        ))}
      </div>

      {/* Add new letter button (admin only would be here) */}
      <div className="mt-8 p-6 bg-[var(--soft)] rounded-xl text-center">
        <p className="text-opacity-70">Все письма созданы через админку</p>
      </div>
    </main>
  )
}