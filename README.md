# Купоны (Next.js + Telegram)

Стек: Next.js (App Router), TypeScript. Уведомления идут в Telegram через бота.

## Структура
- `lib/coupons.ts`: список купонов (меняй тут)
- `components/coupon_board.tsx`, `components/scratch_cover.tsx`: интерфейс и скретч
- `app/api/notify/route.ts`: серверный роут, шлёт сообщения боту

## Бот
1. В Telegram открой @BotFather → `/newbot` → получи `BOT_TOKEN`.
2. Напиши своему боту `/start`.
3. Открой `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`, найди `"chat":{"id":...}`, это `CHAT_ID`.

## Локально
```
npm install
cp .env.example .env.local   # впиши BOT_TOKEN и CHAT_ID
npm run dev
```

## Деплой на Vercel
Через GitHub: импортируй репозиторий на vercel.com, в Settings → Environment Variables добавь `BOT_TOKEN` и `CHAT_ID`, затем Redeploy.
Через CLI:
```
npm i -g vercel
vercel
vercel env add BOT_TOKEN
vercel env add CHAT_ID
vercel --prod
```

Ссылка для неё: `https://твой-проект.vercel.app` (опционально `?name=Аня`).
