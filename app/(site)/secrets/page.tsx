"use client";

import { useState, useEffect } from "react";
import { get_list } from "@/lib/content";
import type { Secret, UserSecret, Settings } from "@/lib/types";

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [foundSecrets, setFoundSecrets] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const secretsRaw = await get_list("secrets");
      setSecrets(secretsRaw as Secret[]);
    };
    loadData();
  }, []);

  const handleFindSecret = (secret: Secret) => {
    if (foundSecrets.includes(secret.id)) return;
    
    // Check if condition is met (in real app, this would be server-side)
    const conditionMet = checkCondition(secret.condition);
    
    if (conditionMet) {
      setFoundSecrets((prev) => [...prev, secret.id]);
      // Play sound if enabled
      if (soundEnabled) {
        // Would play "secret found" sound
      }
      
      // Show reveal content
      if (secret.reveal_content && secret.reveal_id) {
        window.alert(`🔐 Секрет найден!\n\n${secret.reveal_content}: ${secret.reveal_id}`);
      }
    } else {
      window.alert(`🔒 Условие не выполнено: ${secret.condition}`);
    }
  };

  const checkCondition = (condition: string): boolean => {
    // Simplified condition checking
    if (!condition) return false;
    
    // visit_count >= X
    const visitMatch = condition.match(/visit_count\s*>=\s*(\d+)/);
    if (visitMatch) {
      const visits = 10; // Would come from user data
      return visits >= parseInt(visitMatch[1]);
    }
    
    // achievement_unlocked = X
    const achievementMatch = condition.match(/achievement_unlocked\s*=\s*(\w+)/);
    if (achievementMatch) {
      // Would check user achievements
      return false;
    }
    
    // secret_found = X
    const secretMatch = condition.match(/secret_found\s*=\s*(\w+)/);
    if (secretMatch) {
      return foundSecrets.includes(secretMatch[1]);
    }
    
    // letter_opened = X
    const letterMatch = condition.match(/letter_opened\s*=\s*(\w+)/);
    if (letterMatch) {
      // Would check opened letters
      return false;
    }
    
    return false;
  };

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      <header className="p-6 mb-8 border-b">
        <h1 className="text-2xl font-bold">🔐 Секреты</h1>
        <p className="text-opacity-80">Найди все скрытые секреты</p>
      </header>

      {/* Stats */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-[var(--card)] rounded-xl text-center">
          <div className="text-3xl font-bold" style={{ color: "#ff5c8a" }}>
            {foundSecrets.length} / {secrets.length}
          </div>
          <div className="text-sm opacity-80">секретов найдено</div>
        </div>
      </div>

      {/* Secrets grid */}
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {secrets.map((secret: any) => (
          <div 
            key={secret.id}
            className={`p-6 bg-[var(--card)] rounded-xl border-l-4 transition-colors ${
              foundSecrets.includes(secret.id) ? "border-green-500" : "border-[var(--pink)]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{foundSecrets.includes(secret.id) ? "✨" : "🔐"}</span>
                <div>
                  <h3 className="font-medium text-lg">{secret.title}</h3>
                  <p className="text-sm opacity-80">{secret.description}</p>
                </div>
              </div>
              {foundSecrets.includes(secret.id) && (
                <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">Найдено</span>
              )}
            </div>
            
            <div className="text-sm opacity-60 mb-4">
              <p>Подсказка: {secret.hint || "Нет подсказки"}</p>
            </div>

            {!foundSecrets.includes(secret.id) && (
              <button 
                onClick={() => handleFindSecret(secret)}
                className="w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
              >
                Попытаться найти
              </button>
            )}
            {foundSecrets.includes(secret.id) && secret.reveal_content && secret.reveal_id && (
              <div className="mt-4 p-3 bg-[var(--soft)] rounded">
                <p className="text-sm font-medium">Раскрыто:</p>
                <p className="text-sm opacity-80">{secret.reveal_content}: {secret.reveal_id}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {secrets.length === 0 && (
        <div className="p-12 text-center opacity-60">
          <p>Секреты появятся здесь после настройки через админку</p>
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