require("@next/env").loadEnvConfig(process.cwd());

const { Pool } = require("pg");

const letters = [
  { id: "letter-sad", emoji: "🫂", condition: "Когда тебе грустно", text: "Сделай глубокий вдох. Ты не одна: я рядом, очень тебя люблю и всегда готов выслушать. Это письмо — мои крепкие объятия на расстоянии 💗" },
  { id: "letter-miss", emoji: "💌", condition: "Когда ты скучаешь по мне", text: "Я тоже скучаю. Вспомни нашу самую тёплую встречу и знай: впереди у нас ещё много таких моментов. Скоро снова обниму тебя!" },
  { id: "letter-tired", emoji: "🌿", condition: "Когда ты устала", text: "Сегодня можно ничего не успевать. Отдохни, выпей воды и побудь в тишине. Ты уже сделала достаточно, а я горжусь тобой." },
  { id: "letter-smile", emoji: "😊", condition: "Когда хочется улыбнуться", text: "Напоминание: твоя улыбка делает даже обычный день особенным. Вот тебе маленькая улыбка в ответ и мысленный поцелуй 😘" },
  { id: "letter-love", emoji: "❤️", condition: "Когда нужно напомнить, как сильно я тебя люблю", text: "Люблю тебя за то, какая ты есть: за доброту, смех, мечты и даже за наши маленькие странности. Спасибо, что ты есть в моей жизни." },
];

const coupons = [
  { id: "c1", hue: 340, emoji: "🤗", title: "Обнимашки", text: "Долгие тёплые обнимашки в любой момент" },
  { id: "c2", hue: 20, emoji: "🍝", title: "Ужин на мне", text: "Готовлю или заказываю, выбираешь ты" },
  { id: "c3", hue: 280, emoji: "🎬", title: "Ты выбираешь фильм", text: "Никаких споров — смотрю до конца" },
  { id: "c4", hue: 160, emoji: "💆", title: "Массаж", text: "15 минут расслабляющего массажа" },
  { id: "c5", hue: 40, emoji: "☕", title: "Кофе и десерт", text: "Идём в твоё любимое место" },
  { id: "c6", hue: 210, emoji: "🌃", title: "Вечерняя прогулка", text: "Гуляем где захочешь, телефоны убраны" },
  { id: "c7", hue: 320, emoji: "💋", title: "Поцелуй по запросу", text: "Один звонок — один поцелуй" },
  { id: "c8", hue: 0, emoji: "🎁", title: "Маленький сюрприз", text: "Что-то приятное, сама увидишь" },
];

const achievements = [
  { id: "ach-first-visit", category: "Визиты", title: "Первый визит", description: "Ты заглянула на наш маленький сайт впервые.", icon: "🌷", target: 1, reward_type: "", reward_id: "", hidden: false, unlocked: false },
  { id: "ach-regular", category: "Визиты", title: "Частый гость", description: "Загляни сюда пять раз — здесь всегда тебе рады.", icon: "🏡", target: 5, reward_type: "", reward_id: "", hidden: false, unlocked: false },
  { id: "ach-letter", category: "Открытия", title: "Почтовый секрет", description: "Открой одно из писем, приготовленных для тебя.", icon: "💌", target: 1, reward_type: "", reward_id: "", hidden: false, unlocked: false },
  { id: "ach-coupon", category: "Открытия", title: "Первый купон", description: "Открой свой первый купон с сюрпризом.", icon: "🎟️", target: 1, reward_type: "", reward_id: "", hidden: false, unlocked: false },
  { id: "ach-games", category: "Игры", title: "Любознательная", description: "Попробуй любую игру на сайте.", icon: "🎮", target: 1, reward_type: "", reward_id: "", hidden: false, unlocked: false },
];

const secrets = [
  { id: "secret-note", title: "Тайная записка", description: "Ты нашла маленькую тайну — значит, внимательность у тебя отличная.", condition: "Открой раздел секретов", hint: "Иногда стоит заглянуть в укромные уголки сайта.", unlocked_by: "", unlocked_at: "", sort_order: 1, reveal_content: "", reveal_id: "" },
  { id: "secret-star", title: "Звёздный знак", description: "Пусть эта звёздочка напоминает, что ты освещаешь мои дни.", condition: "Найди спрятанную звёздочку", hint: "Ищи там, где обычно выбирают, чем заняться.", unlocked_by: "", unlocked_at: "", sort_order: 2, reveal_content: "", reveal_id: "" },
  { id: "secret-heart", title: "Сердце сайта", description: "Самый главный секрет прост: этот сайт сделан с любовью для тебя.", condition: "Отыщи все остальные секреты", hint: "Последняя тайна появляется после остальных.", unlocked_by: "", unlocked_at: "", sort_order: 3, reveal_content: "", reveal_id: "" },
];

const appSettings = {
  title: "Купоны любви",
  for_whom: "тебя",
  lead: "Здесь собраны маленькие сюрпризы, тёплые слова и наши игры 💖",
  notify_on_open: false,
  notify_on_use: false,
};

function parseJson(value, fallback) {
  if (typeof value !== "string") return value ?? fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

async function seedSetting(client, key, defaults) {
  const { rows } = await client.query("SELECT value FROM settings WHERE key = $1", [key]);
  const current = parseJson(rows[0]?.value, null);
  if (key === "settings") {
    const next = { ...defaults, ...(current && typeof current === "object" && !Array.isArray(current) ? current : {}) };
    await client.query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [key, JSON.stringify(next)]);
    return;
  }
  if (Array.isArray(current) && current.length > 0) return;
  await client.query("INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", [key, JSON.stringify(defaults)]);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
  const client = await pool.connect();
  let stage = "begin";
  try {
    await client.query("BEGIN");
    stage = "users";
    await client.query("INSERT INTO users (username) VALUES ($1) ON CONFLICT (username) DO NOTHING", ["site_guest"]);

    stage = "letters";
    for (const item of letters) {
      await client.query(`INSERT INTO letters (emoji, condition, text, opened)
        SELECT $1::varchar, $2::text, $3::text, false WHERE NOT EXISTS (SELECT 1 FROM letters WHERE condition = $2::text)`, [item.emoji, item.condition, item.text]);
    }
    stage = "achievements";
    for (const item of achievements) {
      await client.query(`INSERT INTO achievements (title, description, icon, target, unlocked)
        SELECT $1::varchar, $2::text, $3::varchar, $4::numeric, false WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE title::text = $1::text)`, [item.title, item.description, item.icon, item.target]);
    }
    stage = "secrets";
    for (const item of secrets) {
      await client.query(`INSERT INTO secrets (title, description, condition, found)
        SELECT $1::varchar, $2::text, $3::text, false WHERE NOT EXISTS (SELECT 1 FROM secrets WHERE title::text = $1::text)`, [item.title, item.description, item.condition]);
    }

    stage = "settings";
    await seedSetting(client, "letters", letters);
    await seedSetting(client, "coupons", coupons);
    await seedSetting(client, "achievements", achievements);
    await seedSetting(client, "secrets", secrets);
    await seedSetting(client, "settings", appSettings);
    await client.query("COMMIT");

    const { rows } = await client.query(`SELECT
      (SELECT count(*)::int FROM users) users,
      (SELECT count(*)::int FROM achievements) achievements,
      (SELECT count(*)::int FROM letters) letters,
      (SELECT count(*)::int FROM secrets) secrets,
      (SELECT count(*)::int FROM settings) settings,
      (SELECT count(*)::int FROM user_achievements) user_achievements,
      (SELECT count(*)::int FROM user_secrets) user_secrets`);
    console.log(JSON.stringify(rows[0]));
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`Seed stage failed: ${stage}`);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ message: error.message, detail: error.detail, hint: error.hint, position: error.position, code: error.code }));
  process.exitCode = 1;
});
