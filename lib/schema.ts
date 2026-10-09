// Схема контента. Чтобы добавить новый раздел в админку, добавь сюда ещё один объект в `collections`.
export type Item = Record<string, string | number | boolean>;

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "emoji" | "number" | "date" | "image" | "toggle";
  max?: number;
  min?: number;
  default?: string | number | boolean;
  placeholder?: string;
  hint?: string;
};

export type Collection = {
  key: string;
  title: string;
  icon: string;
  description?: string;
  kind: "list" | "single";
  title_key?: string;
  fields: Field[];
  defaults: Item[] | Item;
};

export const collections: Collection[] = [
  // ==================== COUPONS ====================
  {
    key: "coupons",
    title: "Купоны",
    icon: "🎟️",
    description: "Билеты, которые нужно стереть, чтобы увидеть.",
    kind: "list",
    title_key: "title",
    fields: [
      { key: "emoji", label: "Эмодзи", type: "emoji", max: 8, default: "💖" },
      { key: "title", label: "Название", type: "text", max: 60 },
      { key: "text", label: "Описание", type: "textarea", max: 200 },
      { key: "hue", label: "Цвет билета (0–360)", type: "number", min: 0, max: 360, default: 340 },
    ],
    defaults: [
      { id: "c1", hue: 340, emoji: "🤗", title: "Обнимашки", text: "Долгие тёплые обнимашки в любой момент" },
      { id: "c2", hue: 20, emoji: "🍝", title: "Ужин на мне", text: "Готовлю или заказываю, выбираешь ты" },
      { id: "c3", hue: 280, emoji: "🎬", title: "Ты выбираешь фильм", text: "Никаких споров, смотрю до конца" },
      { id: "c4", hue: 160, emoji: "💆", title: "Массаж", text: "15 минут расслабляющего массажа" },
      { id: "c5", hue: 40, emoji: "☕", title: "Кофе и десерт", text: "Веду тебя в твоё любимое место" },
      { id: "c6", hue: 210, emoji: "🌃", title: "Вечерняя прогулка", text: "Гуляем где захочешь, телефоны убраны" },
      { id: "c7", hue: 320, emoji: "💋", title: "Поцелуй по запросу", text: "Один звонок, один поцелуй" },
      { id: "c8", hue: 0, emoji: "🎁", title: "Маленький сюрприз", text: "Что-то приятное, сама увидишь" },
    ],
  },

  // ==================== LETTERS ====================
  {
    key: "letters",
    title: "Открой, когда…",
    icon: "💌",
    description: "Письма-конверты на разные случаи.",
    kind: "list",
    title_key: "condition",
    fields: [
      { key: "emoji", label: "Эмодзи", type: "emoji", max: 8, default: "💌" },
      { key: "condition", label: "Когда открыть", type: "text", max: 80, placeholder: "когда грустно" },
      { key: "text", label: "Текст письма", type: "textarea", max: 4000 },
    ],
    defaults: [
      { id: "l1", emoji: "🥺", condition: "когда грустно", text: "Напиши сюда, что хочешь ей сказать." },
      { id: "l2", emoji: "💭", condition: "когда скучаешь", text: "Напиши сюда, что хочешь ей сказать." },
      { id: "l3", emoji: "🌙", condition: "когда не спится", text: "Напиши сюда, что хочешь ей сказать." },
    ],
  },

  // ==================== TIMELINE / MEMORIES ====================
  {
    key: "timeline",
    title: "Наша история",
    icon: "🕰️",
    description: "События с датами и фото.",
    kind: "list",
    title_key: "title",
    fields: [
      { key: "date", label: "Дата", type: "date" },
      { key: "title", label: "Заголовок", type: "text", max: 80 },
      { key: "text", label: "Описание", type: "textarea", max: 1000 },
      { key: "image", label: "Фото (ссылка)", type: "image", hint: "пока по ссылке, загрузку файлов добавим позже" },
    ],
    defaults: [],
  },

  // ==================== SETTINGS ====================
  {
    key: "settings",
    title: "Настройки",
    icon: "⚙️",
    description: "Тексты сайта и уведомления в Telegram.",
    kind: "single",
    fields: [
      { key: "title", label: "Заголовок сайта", type: "text", max: 60 },
      { key: "for_whom", label: "Для кого (в дательном падеже, «для …»)", type: "text", max: 40 },
      { key: "lead", label: "Подзаголовок", type: "textarea", max: 200 },
      { key: "notify_on_open", label: "Уведомлять, когда она открывает купон", type: "toggle" },
      { key: "notify_on_use", label: "Уведомлять, когда она использует купон", type: "toggle" },
    ],
    defaults: {
      title: "Купоны любви",
      for_whom: "Леси",
      lead: "Стирай защитный слой пальцем и узнавай, что тебе подарили 💖",
      notify_on_open: true,
      notify_on_use: true,
    },
  },

  // ==================== ACHIEVEMENTS ====================
  {
    key: "achievements",
    title: "Достижения",
    icon: "🏆",
    description: "Система достижений пользователя",
    kind: "list",
    title_key: "category",
    fields: [
      { key: "category", label: "Категория", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "icon", label: "Иконка", type: "text", placeholder: "🏆" },
      { key: "target", label: "Цель", type: "number", min: 1 },
      { key: "reward_type", label: "Награда", type: "text", placeholder: "letter|secret|page|game|surprise" },
      { key: "reward_id", label: "ID награды", type: "text" },
      { key: "hidden", label: "Скрыто", type: "toggle" },
    ],
    defaults: [],
  },

  // ==================== USER ACHIEVEMENTS ====================
  {
    key: "user_achievements",
    title: "User Achievements",
    icon: "🏆",
    description: "Progress tracking for achievements",
    kind: "list",
    title_key: "achievement_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "achievement_id", label: "Achievement ID", type: "text" },
      { key: "unlocked_at", label: "Открыто", type: "date" },
    ],
    defaults: [],
  },

  // ==================== SECRETS ====================
  {
    key: "secrets",
    title: "Секреты",
    icon: "🔐",
    description: "Скрытые секреты и пасхалки",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "condition", label: "Условие открытия", type: "textarea", placeholder: "visit_count >= 5 или achievement_unlocked = X" },
      { key: "hint", label: "Подсказка", type: "textarea", placeholder: "Подсказка для пользователя" },
      { key: "unlocked_by", label: "Открыто пользователем", type: "text" },
      { key: "unlocked_at", label: "Открыто", type: "date" },
      { key: "sort_order", label: "Порядок", type: "number", default: 0 },
      { key: "reveal_content", label: "Что открывается", type: "text", placeholder: "letter|secret|page|surprise|achievement" },
      { key: "reveal_id", label: "ID содержимого", type: "text" },
    ],
    defaults: [],
  },

  // ==================== USER SECRETS ====================
  {
    key: "user_secrets",
    title: "User Secrets",
    icon: "🔐",
    description: "Progress tracking for secrets",
    kind: "list",
    title_key: "secret_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "secret_id", label: "Secret ID", type: "text" },
      { key: "found_at", label: "Найдено", type: "date" },
    ],
    defaults: [],
  },

  // ==================== GALLERY / PHOTOS ====================
  {
    key: "photos",
    title: "Фотогалерея",
    icon: "📸",
    description: "Фотографии и видео Леси",
    kind: "list",
    title_key: "album_id",
    fields: [
      { key: "album_id", label: "Альбом", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "image_url", label: "Изображение", type: "image" },
      { key: "date", label: "Дата", type: "date" },
      { key: "tags", label: "Теги", type: "text", placeholder: "через запятую" },
      { key: "is_secret", label: "Заблокировано", type: "toggle" },
      { key: "unlock_condition", label: "Условие разблокировки", type: "text", placeholder: "secret:3 или achievement:first_secret" },
    ],
    defaults: [],
  },

  // ==================== ALBUMS ====================
  {
    key: "albums",
    title: "Альбомы",
    icon: "📁",
    description: "Группировка фотографий",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "cover_image", label: "Обложка", type: "image" },
    ],
    defaults: [],
  },

  // ==================== GAMES ====================
  {
    key: "games",
    title: "Игры",
    icon: "🎮",
    description: "Игровые раунды и викторины",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "type", label: "Тип", type: "text", placeholder: "quiz|song_guess|photo_guess|would_you_rather|date_choice" },
      { key: "image", label: "Изображение", type: "image" },
      { key: "audio_url", label: "Аудио/Музыка", type: "image", hint: "URL to audio file" },
      { key: "is_active", label: "Активно", type: "toggle" },
    ],
    defaults: [],
  },

  // ==================== WHEEL DEFAULTS ====================
  {
    key: "wheel_options",
    title: "Колесо случайностей",
    icon: "🎡",
    description: "Варианты и их вес для нового запуска колеса. Вес выше — шанс выпасть больше.",
    kind: "list",
    title_key: "label",
    fields: [
      { key: "label", label: "Вариант (можно добавить эмодзи)", type: "text", max: 80 },
      { key: "weight", label: "Вес / шанс", type: "number", min: 1, max: 100, default: 1 },
    ],
    defaults: [
      { id: "w1", label: "🎬 Фильм", weight: 1 },
      { id: "w2", label: "🍝 Ресторан", weight: 1 },
      { id: "w3", label: "🏖️ Пляж", weight: 1 },
      { id: "w4", label: "🚗 Поездка", weight: 1 },
      { id: "w5", label: "🍿 Домашний кинотеатр", weight: 1 },
      { id: "w6", label: "🎮 Игровая ночь", weight: 1 },
      { id: "w7", label: "☕ Кофе и десерт", weight: 1 },
      { id: "w8", label: "🎁 Сюрприз!", weight: 2 },
    ],
  },

  // ==================== GAME QUESTIONS ====================
  {
    key: "game_questions",
    title: "Game Questions",
    icon: "❓",
    description: "Вопросы и варианты ответов",
    kind: "list",
    title_key: "game_id",
    fields: [
      { key: "game_id", label: "ID игры", type: "text" },
      { key: "question", label: "Вопрос", type: "textarea" },
      { key: "image", label: "Изображение", type: "image" },
      { key: "option_a", label: "Вариант A", type: "text" },
      { key: "option_b", label: "Вариант B", type: "text" },
      { key: "option_c", label: "Вариант C", type: "text" },
      { key: "option_d", label: "Вариант D", type: "text" },
      { key: "correct_answer", label: "Правильный ответ", type: "text" },
      { key: "explanation", label: "Пояснение", type: "textarea" },
      { key: "points", label: "Очки", type: "number", default: 10 },
    ],
    defaults: [],
  },

  // ==================== USER GAME ATTEMPTS ====================
  {
    key: "user_game_attempts",
    title: "User Game Attempts",
    icon: "🎮",
    description: "Tracking user game progress",
    kind: "list",
    title_key: "attempt_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "game_id", label: "Game ID", type: "text" },
      { key: "score", label: "Счет", type: "number", default: 0 },
      { key: "completed", label: "Завершено", type: "toggle" },
      { key: "completed_at", label: "Завершено", type: "date" },
    ],
    defaults: [],
  },

  // ==================== WOULD YOU RATHER ====================
  {
    key: "would_you_rather",
    title: "Would You Rather",
    icon: "💜",
    description: "Would You Rather вопросы",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "question", label: "Вопрос", type: "textarea" },
      { key: "option_a", label: "Вариант A", type: "text" },
      { key: "option_b", label: "Вариант B", type: "text" },
      { key: "popular_a", label: "Популярно A", type: "number", default: 0 },
      { key: "popular_b", label: "Популярно B", type: "number", default: 0 },
    ],
    defaults: [],
  },

  // ==================== USER WOULD YOU RATHER ====================
  {
    key: "user_would_you_rather",
    title: "User Would You Rather",
    icon: "💜",
    description: "User's answers to Would You Rather",
    kind: "list",
    title_key: "user_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "wyr_id", label: "Вопрос ID", type: "text" },
      { key: "chose_a", label: "Выбрал A", type: "toggle" },
      { key: "answered_at", label: "Отвечено", type: "date" },
    ],
    defaults: [],
  },

  // ==================== EVENTS ====================
  {
    key: "events",
    title: "События",
    icon: "📅",
    description: "Дата-driven события и праздники",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "event_type", label: "Тип", type: "text", placeholder: "DATE|TIME|USER_ACTION|ACHIEVEMENT|SECRET|GAME_RESULT|VISIT_COUNT|CHAIN" },
      { key: "event_date", label: "Дата", type: "date" },
      { key: "event_time", label: "Время", type: "text", placeholder: "HH:MM" },
      { key: "is_active", label: "Активно", type: "toggle" },
      { key: "content_type", label: "Тип контента", type: "text", placeholder: "letter|secret|theme|surprise" },
      { key: "content_id", label: "ID контента", type: "text" },
      { key: "reward_type", label: "Награда", type: "text", placeholder: "letter|secret|theme|surprise" },
      { key: "reward_id", label: "ID награды", type: "text" },
    ],
    defaults: [],
  },

  // ==================== USER EVENTS ====================
  {
    key: "user_events",
    title: "User Events",
    icon: "📅",
    description: "User's event history",
    kind: "list",
    title_key: "user_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "event_id", label: "Event ID", type: "text" },
      { key: "triggered_at", label: "Триггеринг", type: "date" },
      { key: "completed", label: "Завершено", type: "toggle" },
    ],
    defaults: [],
  },

  // ==================== SURPRISES ====================
  {
    key: "surprises",
    title: "Сюрпризы",
    icon: "✨",
    description: "Сюрпризы для пользователя",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "type", label: "Тип", type: "text", placeholder: "text|photo|video|music|animation|page|code|gift|link" },
      { key: "content", label: "Содержимое", type: "textarea" },
      { key: "image_url", label: "Изображение", type: "image" },
      { key: "music_url", label: "Музыка", type: "image", hint: "URL to audio" },
      { key: "animation", label: "Анимация", type: "text", placeholder: "CSS animation name" },
      { key: "condition", label: "Условие активации", type: "textarea", placeholder: "achievement_unlocked = X или visit_count >= 10" },
      { key: "is_active", label: "Активно", type: "toggle" },
      { key: "unlocked_by", label: "Открыто пользователем", type: "text" },
      { key: "unlocked_at", label: "Открыто", type: "date" },
    ],
    defaults: [],
  },

  // ==================== USER SURPRISES ====================
  {
    key: "user_surprises",
    title: "User Surprises",
    icon: "✨",
    description: "User's opened surprises",
    kind: "list",
    title_key: "user_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "surprise_id", label: "Surprise ID", type: "text" },
      { key: "opened_at", label: "Открыто", type: "date" },
    ],
    defaults: [],
  },

  // ==================== THEMES ====================
  {
    key: "themes",
    title: "Темы",
    icon: "🎨",
    description: "Динамические темы сайта",
    kind: "list",
    title_key: "id",
    fields: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Название", type: "text" },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "background_color", label: "Фоновый цвет", type: "text" },
      { key: "primary_color", label: "Основной цвет", type: "text" },
      { key: "secondary_color", label: "Второстепенный цвет", type: "text" },
      { key: "font", label: "Шрифт", type: "text" },
      { key: "is_active", label: "Активно", type: "toggle" },
    ],
    defaults: [],
  },

  // ==================== USER THEMES ====================
  {
    key: "user_themes",
    title: "User Themes",
    icon: "🎨",
    description: "User's selected themes",
    kind: "list",
    title_key: "user_id",
    fields: [
      { key: "user_id", label: "User ID", type: "text" },
      { key: "theme_id", label: "Theme ID", type: "text" },
      { key: "selected_at", label: "Выбрано", type: "date" },
    ],
    defaults: [],
  },
];

// Export individual collections for easy access
export const coupons = collections.find(c => c.key === "coupons")!;
export const letters = collections.find(c => c.key === "letters")!;
export const timeline = collections.find(c => c.key === "timeline")!;
export const settings = collections.find(c => c.key === "settings")!;
export const achievements = collections.find(c => c.key === "achievements")!;
export const user_achievements = collections.find(c => c.key === "user_achievements")!;
export const secrets = collections.find(c => c.key === "secrets")!;
export const user_secrets = collections.find(c => c.key === "user_secrets")!;
export const photos = collections.find(c => c.key === "photos")!;
export const albums = collections.find(c => c.key === "albums")!;
export const games = collections.find(c => c.key === "games")!;
export const game_questions = collections.find(c => c.key === "game_questions")!;
export const user_game_attempts = collections.find(c => c.key === "user_game_attempts")!;
export const would_you_rather = collections.find(c => c.key === "would_you_rather")!;
export const user_would_you_rather = collections.find(c => c.key === "user_would_you_rather")!;
export const events = collections.find(c => c.key === "events")!;
export const user_events = collections.find(c => c.key === "user_events")!;
export const surprises = collections.find(c => c.key === "surprises")!;
export const user_surprises = collections.find(c => c.key === "user_surprises")!;
export const themes = collections.find(c => c.key === "themes")!;
export const user_themes = collections.find(c => c.key === "user_themes")!;

// Collection keys object for easy access
export const collection_keys = {
  coupons,
  letters,
  timeline,
  settings,
  achievements,
  user_achievements,
  secrets,
  user_secrets,
  photos,
  albums,
  games,
  game_questions,
  user_game_attempts,
  would_you_rather,
  user_would_you_rather,
  events,
  user_events,
  surprises,
  user_surprises,
  themes,
  user_themes,
};

export const get_collection = (key: string) => collections.find((c) => c.key === key);
