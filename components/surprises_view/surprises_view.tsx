"use client";

import { useState } from "react";
import type { Surprise } from "@/lib/types";
import styles from "./cn.module.css";

export default function SurprisesView({ surprises }: { surprises: Surprise[] }) {
  const [openedSurprises, setOpenedSurprises] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSurprise, setSelectedSurprise] = useState<Surprise | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);


  const handleOpenSurprise = (surprise: Surprise) => {
    if (openedSurprises.includes(surprise.id)) {
      // Already opened, show again
      setSelectedSurprise(surprise);
      setShowModal(true);
      return;
    }
    
    // Check condition
    const conditionMet = checkCondition(surprise.condition);
    
    if (conditionMet) {
      setOpenedSurprises((prev) => [...prev, surprise.id]);
      setSelectedSurprise(surprise);
      setShowModal(true);
      
      // Play sound if enabled
      if (soundEnabled) {
        // Would play "surprise opened" sound
      }
    } else {
      window.alert(`🔒 Условие не выполнено: ${surprise.condition}`);
    }
  };

  const checkCondition = (condition: string): boolean => {
    if (!condition) return true; // No condition = always available
    
    // Simplified condition checking - in real app this would be server-side
    // achievement_unlocked = X
    const achievementMatch = condition.match(/achievement_unlocked\s*=\s*(\w+)/);
    if (achievementMatch) {
      return false; // Would check user achievements
    }
    
    // visit_count >= X
    const visitMatch = condition.match(/visit_count\s*>=\s*(\d+)/);
    if (visitMatch) {
      const visits = 10; // Would come from user data
      return visits >= parseInt(visitMatch[1]);
    }
    
    // secret_found = X
    const secretMatch = condition.match(/secret_found\s*=\s*(\w+)/);
    if (secretMatch) {
      // Would check user secrets
      return false;
    }
    
    return false;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSurprise(null);
  };

  return (
    <main className={styles.page}>
      <header className="p-6 mb-8 border-b">
        <h1 className="text-2xl font-bold">✨ Сюрпризы</h1>
        <p className="text-opacity-80">Открый специальные подарки</p>
      </header>

      {/* Stats */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-[var(--card)] rounded-xl text-center">
          <div className="text-3xl font-bold" style={{ color: "#ff5c8a" }}>
            {openedSurprises.length} / {surprises.length}
          </div>
          <div className="text-sm opacity-80">сюрпризов открыто</div>
        </div>
      </div>

      {/* Surprises grid */}
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {surprises.map((surprise: any) => (
          <div 
            key={surprise.id}
            className={`p-6 bg-[var(--card)] rounded-xl border-l-4 transition-colors cursor-pointer ${
              openedSurprises.includes(surprise.id) ? "border-yellow-500" : "border-[var(--pink)]"
            }`}
            onClick={() => handleOpenSurprise(surprise)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{openedSurprises.includes(surprise.id) ? "🎁" : "✨"}</span>
                <div>
                  <h3 className="font-medium text-lg">{surprise.title}</h3>
                  <p className="text-sm opacity-80">{surprise.description}</p>
                </div>
              </div>
              {openedSurprises.includes(surprise.id) && (
                <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">Открыто</span>
              )}
            </div>
            
            {surprise.condition && (
              <div className="text-sm opacity-60 mb-4">
                <p>Условие: {surprise.condition}</p>
              </div>
            )}

            {!openedSurprises.includes(surprise.id) && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenSurprise(surprise); }}
                className="w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
              >
                Открыть
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {surprises.length === 0 && (
        <div className="p-12 text-center opacity-60">
          <p>Сюрпризы появятся здесь после настройки через админку</p>
        </div>
      )}

      {/* Modal for viewing surprise */}
      {showModal && selectedSurprise && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4"
        >
          <div 
            className="bg-[var(--card)] rounded-xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedSurprise.title}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-2xl hover:text-[var(--pink)] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p className="text-opacity-80 mb-6">{selectedSurprise.description}</p>
            
            {selectedSurprise.image_url && (
              <img 
                src={selectedSurprise.image_url} 
                alt={selectedSurprise.title} 
                className="w-full h-48 object-cover rounded mb-6"
              />
            )}
            
            {selectedSurprise.music_url && (
              <audio controls className="w-full mb-6">
                <source src={selectedSurprise.music_url} type="audio/mpeg" />
              </audio>
            )}
            
            {selectedSurprise.content && (
              <div className="p-4 bg-[var(--soft)] rounded mb-6">
                <p className="text-opacity-80">{selectedSurprise.content}</p>
              </div>
            )}
            
            {selectedSurprise.type === "code" && selectedSurprise.content && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded font-mono text-center mb-6">
                <p className="text-lg font-bold">{selectedSurprise.content}</p>
              </div>
            )}
            
            <button 
              onClick={handleCloseModal}
              className="w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

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
