import Link from "next/link";

const games = [
  {
    href: "/games",
    icon: "💌",
    label: "ВИКТОРИНА",
    title: "Насколько хорошо ты меня знаешь?",
    description: "Пять вопросов о любимых вещах, привычках и мечтах.",
    action: "Проверить себя",
  },
  {
    href: "/date_choice",
    icon: "🌹",
    label: "СОБЕРИ ПЛАН",
    title: "Выбери наше свидание",
    description: "Подбери место, время и настроение для нашего вечера.",
    action: "Выбрать свидание",
  },
  {
    href: "/wheel",
    icon: "🎡",
    label: "КРУТИ И УЗНАЙ",
    title: "Колесо случайностей",
    description: "Пусть случай решит, чем займёмся дальше.",
    action: "Крутить колесо",
  },
];

export default function HomePage() {
  return (
    <main className="game_home">
      <header className="game_home_header">
        <span className="game_eyebrow">МАЛЕНЬКИЙ УГОЛОК ДЛЯ НАС</span>
        <h1>Во что сыграем?</h1>
        <p>Выбирай игру — и давай проведём время вместе 💗</p>
      </header>

      <section className="game_cards" aria-label="Доступные игры">
        {games.map((game, index) => (
          <Link className="game_card" href={game.href} key={game.href}>
            <span className="game_card_number">0{index + 1}</span>
            <span className="game_card_icon" aria-hidden="true">{game.icon}</span>
            <span className="game_card_meta">{game.label}</span>
            <span className="game_card_title">{game.title}</span>
            <span className="game_card_description">{game.description}</span>
            <span className="game_card_action">{game.action} <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>

      <Link className="game_coupon_link" href="/coupons">
        <span aria-hidden="true">🎟️</span>
        <span><strong>А ещё у нас есть купоны</strong><small>Заглянуть в коробочку с сюрпризами</small></span>
        <span className="game_coupon_arrow" aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
