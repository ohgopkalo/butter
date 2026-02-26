function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function rand(min, max){ return min + Math.random() * (max - min); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");
  if (!stage || !bread || !knife) return;

  // --- Позиція курсора (ніж = курсор 1:1)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  stage.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    knife.style.left = mx + "px";
    knife.style.top  = my + "px";
  });

  stage.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    mx = t.clientX;
    my = t.clientY;
    knife.style.left = mx + "px";
    knife.style.top  = my + "px";
  }, { passive: true });

  // стартова позиція ножа
  knife.style.left = mx + "px";
  knife.style.top  = my + "px";

  // --- Хліб
  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  let vx = rand(-0.5, 0.5);
  let vy = rand(-0.5, 0.5);

  function animate(){

    // Плавне базове плавання
    vx += rand(-0.02, 0.02);
    vy += rand(-0.02, 0.02);

    // --- ВТЕЧА ВІД НОЖА
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy);

    const fleeRadius = 150;   // коли ближче ніж 150px
    const fleePower  = 0.5;   // сила втечі

    if (dist < fleeRadius){
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      // сильний поштовх в протилежну сторону
      vx += nx * fleePower;
      vy += ny * fleePower;
    }

    // демпфування
    vx *= 0.98;
    vy *= 0.98;

    // рух
    bx += vx;
    by += vy;

    // межі екрану
    const rect = bread.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const minX = halfW;
    const maxX = window.innerWidth - halfW;
    const minY = halfH;
    const maxY = window.innerHeight - halfH;

    if (bx < minX){ bx = minX; vx *= -0.8; }
    if (bx > maxX){ bx = maxX; vx *= -0.8; }
    if (by < minY){ by = minY; vy *= -0.8; }
    if (by > maxY){ by = maxY; vy *= -0.8; }

    bread.style.left = bx + "px";
    bread.style.top  = by + "px";

    requestAnimationFrame(animate);
  }

  animate();
});
