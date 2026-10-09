import Link from "next/link";
import styles from "./cn.module.css";

const pages = [
  { href: "/games", icon: "💌", label: "ВИКТОРИНА", title: "Как хорошо ты меня знаешь?", description: "Пять вопросов о любимых вещах, привычках и мечтах.", action: "Проверить себя" },
  { href: "/date_choice", icon: "🌹", label: "НАШ ПЛАН", title: "Выбери наше свидание", description: "Подбери место, время и настроение для нашего вечера.", action: "Выбрать свидание" },
  { href: "/wheel", icon: "🎡", label: "СЛУЧАЙНЫЙ ВЫБОР", title: "Колесо фортуны", description: "Пусть случай решит, чем займёмся дальше.", action: "Крутить колесо" },
  { href: "/coupons", icon: "🎟️", label: "ПОДАРКИ", title: "Купоны", description: "Коробочка с маленькими сюрпризами и желаниями.", action: "Открыть купоны" },
  { href: "/gallery", icon: "📸", label: "НАШИ МОМЕНТЫ", title: "Фотогалерея", description: "Фотографии и альбомы с дорогими воспоминаниями.", action: "Смотреть фото" },
  { href: "/memories", icon: "🕰️", label: "НАША ИСТОРИЯ", title: "Воспоминания", description: "Важные события и моменты, которые хочется сохранить.", action: "Вспомнить" },
  { href: "/letters", icon: "✉️", label: "ОТКРОЙ, КОГДА…", title: "Письма", description: "Тёплые слова для разных дней и настроений.", action: "Открыть письма" },
  { href: "/secrets", icon: "🔐", label: "СЕКРЕТЫ", title: "Тайные послания", description: "Ищи подсказки и открывай то, что спрятано.", action: "Найти секреты" },
  { href: "/surprises", icon: "🎁", label: "СЮРПРИЗЫ", title: "Особенные подарки", description: "Загляни за сюрпризами, приготовленными для тебя.", action: "Посмотреть" },
  { href: "/explore", icon: "✨", label: "ВСЁ СРАЗУ", title: "Исследовать сайт", description: "Письма, секреты, достижения и другие уголки сайта.", action: "Исследовать" },
  { href: "/profile", icon: "💖", label: "МОЙ УГОЛОК", title: "Профиль", description: "Твой прогресс, письма, фотографии и достижения.", action: "Открыть профиль" },
];

export default function GameLobby() {
  return (
    <main className={styles.game_home}>
      <header className={styles.game_home_header}>
        <span className={styles.game_eyebrow}>МАЛЕНЬКИЙ УГОЛОК ДЛЯ НАС</span>
        <h1>Куда заглянем?</h1>
        <p>Выбирай страницу — здесь собраны наши игры, воспоминания и сюрпризы 💗</p>
      </header>
      <section className={styles.game_cards} aria-label="Страницы сайта">
        {pages.map((page, index) => (
          <Link className={styles.game_card} href={page.href} key={page.href}>
            <span className={styles.game_card_number}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.game_card_icon} aria-hidden="true">{page.icon}</span>
            <span className={styles.game_card_meta}>{page.label}</span>
            <span className={styles.game_card_title}>{page.title}</span>
            <span className={styles.game_card_description}>{page.description}</span>
            <span className={styles.game_card_action}>{page.action}<span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>
    </main>
  );
}
