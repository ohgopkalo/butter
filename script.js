function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function rand(min, max){ return min + Math.random() * (max - min); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const breadEl = document.getElementById("bread");
  const knifeEl = document.getElementById("knife");
  if (!stage || !breadEl || !knifeEl) return;

  // --- Knife follows mouse (slight smoothing)
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let kx = mx, ky = my;

  stage.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  stage.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    mx = t.clientX; my = t.clientY;
  }, { passive: true });

  // --- Bread physics
  let bx = window.innerWidth * 0.5;
  let by = window.innerHeight * 0.5;
  let bvx = rand(-0.6, 0.6);
  let bvy = rand(-0
