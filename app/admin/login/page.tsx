"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.href = "/admin";
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error || "Не удалось войти. Проверь пароль.");
    } catch {
      setError("Нет соединения с сервером. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm_login">
      <form className="adm_card" onSubmit={submit}>
        <div className="adm_login_brand">
          <span className="adm_brand_mark" aria-hidden="true">💗</span>
          <span>
            <strong>ForLess</strong>
            <small>ПАНЕЛЬ УПРАВЛЕНИЯ</small>
          </span>
        </div>
        <div className="adm_login_intro">
          <h1>С возвращением</h1>
          <p>Войди, чтобы управлять сайтом.</p>
        </div>
        <label className="adm_login_label" htmlFor="admin-password">Пароль</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          aria-label="Пароль администратора"
          placeholder="Введи пароль администратора"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <div className="adm_error" role="alert">{error}</div>}
        <button className="adm_btn primary adm_login_submit" type="submit" disabled={busy || !password}>
          {busy ? "Входим…" : "Войти в панель"}
        </button>
        <p className="adm_login_note">Доступ только для администратора сайта.</p>
      </form>
    </div>
  );
}
