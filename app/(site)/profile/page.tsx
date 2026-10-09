"use client";

import { useState, useEffect } from "react";
import { get_list, get_single } from "@/lib/content";
import type { Letter, Secret, Achievement, Photo, Album, User, Settings } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [lettersRaw, secretsRaw, achievementsRaw, photosRaw, albumsRaw, settings] = await Promise.all([
        get_list("letters"),
        get_list("secrets"),
        get_list("achievements"),
        get_list("photos"),
        get_list("albums"),
        get_single("settings"),
      ]);

      setLetters(lettersRaw as Letter[]);
      setSecrets(secretsRaw as Secret[]);
      setAchievements(achievementsRaw as Achievement[]);
      setPhotos(photosRaw as Photo[]);
      setAlbums(albumsRaw as Album[]);
    };
    loadData();
  }, []);

  const handleLetterOpen = (letter: Letter) => {
    setSelectedLetter(letter);
    setShowModal(true);
    // Play opening sound if enabled
    if (soundEnabled) {
      // Would play sound
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLetter(null);
  };

  if (!user) {
    return <div className="min-h-screen p-6">Загрузка профиля...</div>;
  }

  const progress = {
    letters: letters.length > 0 ? Math.round((letters.filter((l: any) => l.opened).length / letters.length) * 100) : 0,
    secrets: secrets.length > 0 ? Math.round((secrets.filter((s: any) => s.found).length / secrets.length) * 100) : 0,
    achievements: achievements.length > 0 ? Math.round((achievements.filter((a: any) => a.unlocked).length / achievements.length) * 100) : 0,
    photos: photos.length > 0 ? Math.round((photos.filter((p: any) => !p.is_secret).length / photos.length) * 100) : 0,
  };

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      {/* Header with back button */}
      <header className="p-6 mb-8 border-b">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card)] rounded hover:bg-[var(--soft)] transition-colors"
        >
          ← Назад
        </button>
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[var(--pink)] flex items-center justify-center font-bold text-white text-lg">
            {user.name?.charAt(0) || "Л"}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user.name || "Леся"}</h1>
            <p className="text-sm opacity-80">Профиль</p>
          </div>
        </div>
      </header>

      {/* Progress overview */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-lg font-bold mb-6">Мой прогресс</h2>
        <div className="grid grid-cols-2 gap-4">
          {[["Письма", "💌", progress.letters], ["Секреты", "🔐", progress.secrets], ["Достижения", "🏆", progress.achievements], ["Фото", "📸", progress.photos]].map(
            ([title, icon, percentage]) => (
              <div key={title} className="p-4 bg-[var(--card)] rounded-xl text-center">
                <div className="text-3xl font-bold" style={{ color: "#ff5c8a" }}>{percentage}%</div>
                <div className="text-sm opacity-80 mt-1">{title}</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Letters section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">💌 Письма "Открой, когда…"</h2>
        <div className="grid grid-cols-2 gap-6">
          {letters.map((letter: any) => (
            <div key={letter.id} className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{letter.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{letter.condition}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{letter.text.substring(0, 100)}{letter.text.length > 100 ? "..." : ""}</p>
                </div>
              </div>
              {!letter.opened && (
                <button 
                  onClick={() => handleLetterOpen(letter)}
                  className="mt-3 w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
                >
                  Открыть письмо
                </button>
              )}
              {letter.opened && (
                <p className="mt-3 text-sm opacity-80">Открыто</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Secrets section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">🔐 Секреты</h2>
        <div className="grid grid-cols-2 gap-6">
          {secrets.map((secret: any) => (
            <div key={secret.id} className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{secret.emoji || "🔐"}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{secret.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{secret.description.substring(0, 80)}{secret.description.length > 80 ? "..." : ""}</p>
                </div>
              </div>
              {!secret.found && (
                <button 
                  onClick={() => {/* Would reveal secret */}}
                  className="mt-3 w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
                >
                  Попытаться найти
                </button>
              )}
              {secret.found && (
                <p className="mt-3 text-sm opacity-80">Найдено!</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Achievements section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">🏆 Достижения</h2>
        <div className="grid grid-cols-2 gap-6">
          {achievements.map((achievement: any) => (
            <div key={achievement.id} className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{achievement.icon || "🏆"}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm opacity-80">{achievement.description}</p>
                </div>
              </div>
              {!achievement.unlocked && (
                <button 
                  onClick={() => {/* Would unlock achievement */}}
                  className="mt-3 w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
                >
                  Отслеживать
                </button>
              )}
              {achievement.unlocked && (
                <p className="mt-3 text-sm opacity-80">Разблокировано</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Photos/Gallery section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">📸 Фотогалерея</h2>
        <div className="grid grid-cols-2 gap-6">
          {photos.map((photo: any) => (
            <div key={photo.id} className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors cursor-pointer"
              onClick={() => {/* Open fullscreen */}}
            >
              <div className="aspect-square bg-gray-200 rounded mb-3 overflow-hidden">
                {photo.image_url ? (
                  <img 
                    src={photo.image_url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-opacity-50">
                    Нет фото
                  </div>
                )}
              </div>
              <h4 className="text-sm font-medium line-clamp-1">{photo.title}</h4>
              <p className="text-xs opacity-60 mt-1">{new Date(photo.date).toLocaleDateString()}</p>
              {photo.is_secret && (
                <p className="mt-1 text-sm opacity-80 text-red-500">🔒 Заблокировано</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Albums */}
      <section>
        <h2 className="text-xl font-bold mb-4">Альбомы</h2>
        <div className="grid grid-cols-2 gap-6">
          {albums.map((album: any) => (
            <div key={album.id} className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors">
              <h3>{album.name}</h3>
              <p className="text-sm opacity-80">{album.description || "Без описания"}</p>
              {album.cover_image ? (
                <img 
                  src={album.cover_image} 
                  alt={album.name} 
                  className="w-full h-24 object-cover mt-2 rounded"
                />
              ) : (
                <div className="w-full h-24 bg-gray-300 rounded mt-2 flex items-center justify-center text-opacity-50">Обложка</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sound toggle */}
      <div className="fixed top-6 left-6">
        <button 
          onClick={() => setSoundEnabled((prev) => !prev)}
          className="p-3 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors flex items-center gap-2"
        >
          <span className="text-2xl">🔊</span>
          <span>{soundEnabled ? "Вкл" : "Выкл"}</span>
        </button>
      </div>
    </main>
  )
}