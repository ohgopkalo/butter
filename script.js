function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

window.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".wrapper");
  const pet  = document.querySelector(".pet");

  // Якщо не знайшло — значить в HTML нема .wrapper або .pet
  if (!wrap || !pet) return;

  let x  = window.innerWidth / 2;
  let y  = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  const follow = 0.18; // швидкість "липання" до курсора

  function tick(){
    x += (tx - x) * follow;
    y += (ty - y) * follow;

    const rect = pet.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const cx = clamp(x, halfW, window.innerWidth - halfW);
    const cy = clamp(y, halfH, window.innerHeight - halfH);

    pet.style.left = `${cx}px`;
    pet.style.top  = `${cy}px`;
    pet.style.transform = "translate(-50%, -50%)"; // без дзеркала

    requestAnimationFrame(tick);
  }
  tick();

  wrap.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  wrap.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    tx = t.clientX;
    ty = t.clientY;
  }, { passive: true });

  window.addEventListener("resize", () => {
    tx = clamp(tx, 0, window.innerWidth);
    ty = clamp(ty, 0, window.innerHeight);
  });
});
