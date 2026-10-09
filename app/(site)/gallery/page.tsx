"use client";

import { useState, useEffect } from "react";
import { get_list, get_single } from "@/lib/content";
import type { Photo, Album, Settings } from "@/lib/types";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [photosRaw, albumsRaw, settingsRaw] = await Promise.all([
        get_list("photos"),
        get_list("albums"),
        get_single("settings"),
      ]);
      setPhotos(photosRaw as Photo[]);
      setAlbums(albumsRaw as Album[]);
      setSettings(settingsRaw as Settings);
    };
    loadData();
  }, []);

  const handleOpenPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
    // Play photo opening sound if enabled
    if (soundEnabled) {
      // Would play sound
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhoto(null);
  };

  const handleToggleSecret = (photo: Photo) => {
    // Would check unlock condition
    console.log("Toggling secret for:", photo.id);
  };

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      {/* Header */}
      <header className="p-6 mb-8 border-b">
        <h1 className="text-2xl font-bold">Фотогалерея 📸</h1>
        <p className="text-opacity-80">Личные фотографии и видео</p>
      </header>

      {/* Filter by album */}
      <div className="mb-8 max-w-2xl mx-auto">
        <select 
          className="px-4 py-2 bg-[var(--bg1)] rounded border"
          onChange={(e) => {
            const albumId = e.target.value;
            // Filter photos by album
          }}
        >
          <option value="">Все альбомы</option>
          {albums.map((album: any) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of photos */}
      <div className="grid grid-cols-2 gap-6 mx-6 max-w-5xl">
        {photos.map((photo: any) => (
          <div 
            key={photo.id}
            className="p-4 bg-[var(--card)] rounded-xl hover:bg-[var(--soft)] transition-colors cursor-pointer"
            onClick={() => handleOpenPhoto(photo)}
          >
            {/* Secret lock badge */}
            {photo.is_secret && (
              <div className="absolute top-2 right-2 bg-[var(--pink)] text-white text-xs rounded px-2">
                🔒
              </div>
            )}
            
            {/* Image */}
            <div className="aspect-square bg-gray-200 rounded mb-3 overflow-hidden">
              {photo.image_url ? (
                <img 
                  src={photo.image_url} 
                  alt={photo.title || "Фотография"} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-opacity-50 rounded">
                  <span className="text-sm">Фото</span>
                </div>
              )}
            </div>
            
            {/* Photo info */}
            <div>
              <h4 className="text-sm font-medium line-clamp-1">{photo.title || "Без названия"}</h4>
              <p className="text-xs opacity-60 mt-1">{new Date(photo.date).toLocaleDateString("ru-RU")}</p>
              {photo.tags && (
                <p className="text-xs opacity-60 mt-1">{photo.tags.split(',').slice(0, 3).join(", ")}</p>
              )}
            </div>
            
            {/* Unlock condition for secret photos */}
            {photo.is_secret && photo.unlock_condition && (
              <p className="mt-2 text-xs opacity-80">
                {photo.unlock_condition}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="p-12 text-center opacity-60">
          <p>Фотографии появятся здесь</p>
        </div>
      )}

      {/* Modal for viewing photo in fullscreen */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
        >
          <div 
            className="relative max-w-2xl max-h-80 w-full bg-[var(--card)] rounded-xl overflow-hidden transform transition-none"
            style={{ transform: 'scale(1)' }}
          >
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[var(--pink)] text-2xl hover:text-[var(--pink_d)] transition-colors"
            >
              ✕
            </button>
            
            {/* Fullscreen image */}
            <div className="aspect-video w-full">
              {selectedPhoto.image_url ? (
                <img 
                  src={selectedPhoto.image_url} 
                  alt={selectedPhoto.title || "Фотография"} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-opacity-50">
                  <span className="text-2xl">📷</span>
                </div>
              )}
            </div>
            
            {/* Photo info */}
            <div className="p-4 pt-8">
              <h3 className="text-xl font-bold mb-2">{selectedPhoto.title || "Фотография"}</h3>
              <p className="text-opacity-80 mb-4">{selectedPhoto.description || ""}</p>
              <div className="flex gap-4 text-sm opacity-60">
                <span>{new Date(selectedPhoto.date).toLocaleDateString("ru-RU")}</span>
                <span>•</span>
                <span>{selectedPhoto.tags || ""}</span>
              </div>
              
              {/* Unlock info */}
              {selectedPhoto.is_secret && selectedPhoto.unlock_condition && (
                <div className="mt-4 p-3 bg-[var(--soft)] rounded">
                  <p className="text-sm font-medium">🔒 {selectedPhoto.unlock_condition}</p>
                </div>
              )}
            </div>
            
            {/* Close button */}
            <button 
              onClick={handleCloseModal}
              className="absolute bottom-4 right-4 py-2 px-4 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  )
}