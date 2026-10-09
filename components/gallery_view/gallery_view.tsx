"use client";

import { useState } from "react";
import Link from "next/link";
import type { Photo, Album } from "@/lib/types";
import styles from "./cn.module.css";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function GalleryView({ photos, albums }: { photos: Photo[]; albums: Album[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const filteredPhotos = (selectedAlbum ? photos.filter((photo) => photo.album_id === selectedAlbum) : photos)
    .slice()
    .sort((a, b) => {
      const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
      return (sortOrder === "newest" ? -1 : 1) * (Number.isNaN(difference) ? 0 : difference);
    });

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← Назад</Link>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerIcon} aria-hidden="true">📸</div>
          <span className={styles.eyebrow}>НАШИ МОМЕНТЫ</span>
        </div>
        <h1>Фотогалерея</h1>
        <p>Маленькие мгновения, к которым всегда приятно возвращаться.</p>
        <div className={styles.headerStats}>
          <span><strong>{photos.length}</strong> {photos.length === 1 ? "фотография" : "фотографий"}</span>
          <i />
          <span><strong>{albums.length}</strong> {albums.length === 1 ? "альбом" : "альбомов"}</span>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div>
          <span className={styles.sectionEyebrow}>АРХИВ</span>
          <h2>{selectedAlbum ? albums.find((album) => album.id === selectedAlbum)?.name : "Все фотографии"}</h2>
        </div>
        <div className={styles.toolbarActions}>
          <button className={styles.sortButton} type="button" onClick={() => setSortOrder((order) => order === "newest" ? "oldest" : "newest")}>
            <span aria-hidden="true">↕</span> {sortOrder === "newest" ? "Сначала новые" : "Сначала старые"}
          </button>
          {albums.length > 0 && (
            <label className={styles.filterLabel}>
              <span>Альбом</span>
              <select value={selectedAlbum} onChange={(event) => setSelectedAlbum(event.target.value)}>
                <option value="">Все альбомы</option>
                {albums.map((album) => <option key={album.id} value={album.id}>{album.name}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>

      {filteredPhotos.length > 0 ? (
        <section className={styles.photoGrid} aria-label="Фотографии">
          {filteredPhotos.map((photo, index) => (
            <button className={styles.photoCard} key={photo.id} type="button" onClick={() => setSelectedPhoto(photo)}>
              <span className={styles.imageFrame}>
                {photo.image_url ? (
                  <img src={photo.image_url} alt={photo.title || "Фотография"} loading="lazy" />
                ) : (
                  <span className={styles.imagePlaceholder} aria-label="Нет изображения">📷</span>
                )}
                {photo.is_secret && <span className={styles.secretBadge} title="Особенное фото" aria-label="Особенное фото">🔒</span>}
                <span className={styles.imageIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.viewHint}>Открыть фото <span aria-hidden="true">↗</span></span>
              </span>
              <span className={styles.photoInfo}>
                <span className={styles.photoTitle}>{photo.title || "Без названия"}</span>
                <span className={styles.photoMeta}>
                  {formatDate(photo.date)}
                  {photo.tags && <span className={styles.tags}>{photo.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 3).join(" · ")}</span>}
                </span>
              </span>
            </button>
          ))}
        </section>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">🖼️</span>
          <h2>{photos.length ? "В этом альбоме пока пусто" : "Фотографии появятся здесь"}</h2>
          <p>{photos.length ? "Выбери другой альбом, чтобы посмотреть остальные снимки." : "Добавь фотографии через админку — они появятся в этой галерее."}</p>
        </div>
      )}

      {selectedPhoto && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedPhoto(null);
        }}>
          <section className={styles.photoModal} role="dialog" aria-modal="true" aria-labelledby="photo-title">
            <button className={styles.closeButton} type="button" onClick={() => setSelectedPhoto(null)} aria-label="Закрыть фото">×</button>
            <div className={styles.modalImage}>
              {selectedPhoto.image_url ? <img src={selectedPhoto.image_url} alt={selectedPhoto.title || "Фотография"} /> : <span aria-hidden="true">📷</span>}
            </div>
            <div className={styles.modalInfo}>
              <span className={styles.eyebrow}>{selectedPhoto.is_secret ? "ОСОБЕННЫЙ МОМЕНТ" : "НАШИ МОМЕНТЫ"}</span>
              <h2 id="photo-title">{selectedPhoto.title || "Фотография"}</h2>
              {selectedPhoto.description && <p>{selectedPhoto.description}</p>}
              <div className={styles.modalMeta}>
                {formatDate(selectedPhoto.date)}
                {selectedPhoto.tags && <span>{selectedPhoto.tags.split(",").map((tag) => tag.trim()).filter(Boolean).join(" · ")}</span>}
              </div>
              {selectedPhoto.is_secret && selectedPhoto.unlock_condition && (
                <div className={styles.unlockNote}><span aria-hidden="true">🔒</span>{selectedPhoto.unlock_condition}</div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
