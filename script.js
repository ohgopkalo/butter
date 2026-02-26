function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");
  if (!stage || !bread || !knife) return;

  // ---- Ніж = курсор
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  stage.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    knife.style.left = mx + "px";
    knife.style.top  = my + "px";
  });

  knife.style.left = mx + "px";
  knife.style.top  = my + "px";

  // ---- Хліб (спокійний політ)
  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  // В 3 рази повільніше
  let vx = 1.0;
  let vy = 0.8;

  function animate(){

    const rect = bread.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const minX = halfW;
    const maxX = window.innerWidth - halfW;
    const minY = halfH;
    const maxY = window.innerHeight - halfH;

    // Базовий повільний рух
    bx += vx;
    by += vy;

    // Відбивання від країв
    if (bx <= minX || bx >= maxX) vx *= -1;
    if (by <= minY || by >= maxY) vy *= -1;

    // --- Реакція на ніж
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy);

    const panicRadius = 160;
    const fleeStrength = 2.8; // швидше, але без істерики

    if (dist < panicRadius){
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      vx = nx * fleeStrength;
      vy = ny * fleeStrength;
    }

    bread.style.left = bx + "px";
    bread.style.top  = by + "px";

    requestAnimationFrame(animate);
  }

  animate();
});