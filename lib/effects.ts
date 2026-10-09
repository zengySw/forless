export function spawn_heart(container: HTMLElement, className = "heart") {
  const h = document.createElement("div");
  h.className = className;
  h.textContent = ["💗", "💖", "💕", "🌸", "✨"][Math.floor(Math.random() * 5)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 20 + "px";
  h.style.animationDuration = 6 + Math.random() * 5 + "s";
  container.appendChild(h);
  setTimeout(() => h.remove(), 11000);
}

export function burst(x: number, y: number, className = "pop_out") {
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = ["💖", "✨", "💗", "🌸"][i % 4];
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--dx", Math.random() * 240 - 120 + "px");
    el.style.setProperty("--dy", -60 - Math.random() * 160 + "px");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

export function confetti(className = "conf") {
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.className = className;
    c.textContent = ["🎉", "💖", "✨", "🌸", "💘"][i % 5];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
}
