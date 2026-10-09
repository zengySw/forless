import Link from "next/link";
import type { Letter, Secret, Achievement, Photo, Album, User } from "@/lib/types";
import styles from "./cn.module.css";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(date);
}

function ProgressCard({ title, icon, current, total, href }: { title: string; icon: string; current: number; total: number; href: string }) {
  const percentage = total ? Math.round((current / total) * 100) : 0;
  return (
    <Link className={styles.progressCard} href={href}>
      <span className={styles.progressIcon} aria-hidden="true">{icon}</span>
      <span className={styles.progressInfo}>
        <span className={styles.progressHeading}>{title}</span>
        <span className={styles.progressNumbers}>{current}<small> / {total}</small></span>
        <span className={styles.progressTrack}><i style={{ width: `${percentage}%` }} /></span>
      </span>
      <span className={styles.progressArrow} aria-hidden="true">↗</span>
    </Link>
  );
}

export default function ProfileView({ user, letters, secrets, achievements, photos, albums }: {
  user: User;
  letters: Letter[];
  secrets: Secret[];
  achievements: Achievement[];
  photos: Photo[];
  albums: Album[];
}) {
  const name = user.name || "Любимая";
  const openedLetters = letters.filter((letter) => letter.opened).length;
  const foundSecrets = secrets.filter((secret) => secret.found).length;
  const unlockedAchievements = achievements.filter((achievement) => achievement.unlocked).length;
  const visiblePhotos = photos.filter((photo) => !photo.is_secret).length;

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← Назад</Link>

      <header className={styles.hero}>
        <div className={styles.avatar} aria-hidden="true">{user.avatar ? <img src={user.avatar} alt="" /> : name.charAt(0).toLocaleUpperCase("ru-RU")}</div>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>ТВОЙ УГОЛОК</span>
          <h1>{name}</h1>
          <p>Здесь собраны твои маленькие открытия и наши общие моменты.</p>
        </div>
        <span className={styles.heroHeart} aria-hidden="true">♡</span>
      </header>

      <section className={styles.progressSection} aria-labelledby="progress-heading">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionEyebrow}>ТВОИ ОТКРЫТИЯ</span><h2 id="progress-heading">Мой прогресс</h2></div>
          <span className={styles.sectionNote}>Продолжай исследовать ✨</span>
        </div>
        <div className={styles.progressGrid}>
          <ProgressCard title="Письма" icon="💌" current={openedLetters} total={letters.length} href="/letters" />
          <ProgressCard title="Секреты" icon="🔐" current={foundSecrets} total={secrets.length} href="/secrets" />
          <ProgressCard title="Достижения" icon="🏆" current={unlockedAchievements} total={achievements.length} href="/profile#achievements" />
          <ProgressCard title="Фотографии" icon="📸" current={visiblePhotos} total={photos.length} href="/gallery" />
        </div>
      </section>

      <section className={styles.contentSection} id="achievements">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionEyebrow}>ТЁПЛЫЕ СЛОВА</span><h2>Письма</h2></div>
          <Link className={styles.sectionLink} href="/letters">Все письма <span aria-hidden="true">→</span></Link>
        </div>
        {letters.length ? (
          <div className={styles.previewGrid}>
            {letters.slice(0, 2).map((letter) => (
              <Link className={styles.letterPreview} href="/letters" key={letter.id}>
                <span className={styles.previewIcon}>{letter.emoji || "💌"}</span>
                <span className={styles.previewCopy}><strong>{letter.condition}</strong><small>{letter.opened ? "Открыто — можно перечитать" : "Внутри есть послание для тебя"}</small></span>
                <span className={letter.opened ? styles.statusOpen : styles.statusClosed}>{letter.opened ? "Открыто" : "Ждёт тебя"}</span>
              </Link>
            ))}
          </div>
        ) : <p className={styles.emptyText}>Письма пока не добавлены.</p>}
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionEyebrow}>МАЛЕНЬКИЕ ЗАГАДКИ</span><h2>Тайны и достижения</h2></div>
          <Link className={styles.sectionLink} href="/secrets">К секретам <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.previewGrid}>
          {secrets.slice(0, 2).map((secret) => (
            <Link className={styles.collectionCard} href="/secrets" key={secret.id}>
              <span className={styles.previewIcon}>{secret.found ? "✨" : secret.emoji || "🔒"}</span>
              <span className={styles.previewCopy}><strong>{secret.title}</strong><small>{secret.found ? "Секрет найден" : secret.hint || secret.description}</small></span>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
          {achievements.slice(0, 2).map((achievement) => (
            <Link className={styles.collectionCard} href="/profile#achievements" key={achievement.id}>
              <span className={styles.previewIcon}>{achievement.icon || "🏆"}</span>
              <span className={styles.previewCopy}><strong>{achievement.title}</strong><small>{achievement.unlocked ? "Достижение открыто" : achievement.description}</small></span>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </Link>
          ))}
          {!secrets.length && !achievements.length && <p className={styles.emptyText}>Секреты и достижения появятся здесь.</p>}
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionEyebrow}>СОХРАНЁННЫЕ МГНОВЕНИЯ</span><h2>Фотографии и альбомы</h2></div>
          <Link className={styles.sectionLink} href="/gallery">Открыть галерею <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.mediaGrid}>
          {photos.filter((photo) => !photo.is_secret).slice(0, 4).map((photo) => (
            <Link className={styles.photoCard} href="/gallery" key={photo.id}>
              {photo.image_url ? <img src={photo.image_url} alt="" loading="lazy" /> : <span className={styles.photoPlaceholder}>📷</span>}
              <span><strong>{photo.title || "Фотография"}</strong><small>{formatDate(photo.date)}</small></span>
            </Link>
          ))}
          {albums.slice(0, 2).map((album) => (
            <Link className={styles.albumCard} href="/gallery" key={album.id}>
              {album.cover_image ? <img src={album.cover_image} alt="" loading="lazy" /> : <span className={styles.albumPlaceholder}>▧</span>}
              <span><strong>{album.name}</strong><small>{album.description || "Наш альбом"}</small></span>
            </Link>
          ))}
          {!photos.length && !albums.length && <p className={styles.emptyText}>Фотографии и альбомы появятся здесь.</p>}
        </div>
      </section>

      <footer className={styles.footer}>Ты — самое любимое приключение <span aria-hidden="true">♡</span></footer>
    </main>
  );
}
