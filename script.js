function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread"); // це sprite-box
  const knife = document.getElementById("knife"); // це sprite-box
  if (!stage || !bread || !knife) return;

  // ---- НІЖ = курсор (1:1)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  function setKnife(x, y){
    mx = x; my = y;
    knife.style.left = mx + "px";
    knife.style.top  = my + "px";
  }

  stage.addEventListener("mousemove", (e) => setKnife(e.clientX, e.clientY));
  stage.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    setKnife(t.clientX, t.clientY);
  }, { passive: true });

  setKnife(mx, my);

  // ---- ХЛІБ = DVD рух
  // позиція (центр)
  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  // швидкість (пікс/кадр). Збільшиш — буде швидше “літати”
  let vx = 3.2;
  let vy = 2.6;

  // щоб втеча не тригерилась щокадру
  let panicCooldown = 0;

  function tick(){
    const rect = bread.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    const minX = halfW;
    const maxX = window.innerWidth - halfW;
    const minY = halfH;
    const maxY = window.innerHeight - halfH;

    // 1) базовий політ
    bx += vx;
    by += vy;

    // 2) відбивання від країв (DVD)
    if (bx <= minX){ bx = minX; vx = Math.abs(vx); }
    if (bx >= maxX){ bx = maxX; vx = -Math.abs(vx); }
    if (by <= minY){ by = minY; vy = Math.abs(vy); }
    if (by >= maxY){ by = maxY; vy = -Math.abs(vy); }

    // 3) паніка, якщо ніж близько: різко “втікає” в інший бік
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy);

    const panicRadius = 170;      // наскільки близько — паніка
    const escapeBoost = 6.0;      // наскільки сильний ривок
    const baseSpeed   = 3.6;      // базова швидкість після паніки

    if (panicCooldown > 0) panicCooldown--;

    if (dist < panicRadius && panicCooldown === 0){
      // напрямок від ножа
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      // ставимо швидкість в протилежний бік + буст
      vx = nx * (baseSpeed + escapeBoost);
      vy = ny * (baseSpeed + escapeBoost);

      // і одразу “підштовхуємо” позицію, щоб відскочило відчутно
      bx += nx * 60;
      by += ny * 60;

      // анти-спам (щоб не дригалось кожен кадр біля ножа)
      panicCooldown = 18; // ~0.3 сек при 60fps
    }

    // застосувати позицію (left/top — це центр, бо в CSS translate(-50%,-50%))
    bread.style.left = bx + "px";
    bread.style.top  = by + "px";

    requestAnimationFrame(tick);
  }

  tick();

  window.addEventListener("resize", () => {
    bx = clamp(bx, 0, window.innerWidth);
    by = clamp(by, 0, window.innerHeight);
    setKnife(clamp(mx, 0, window.innerWidth), clamp(my, 0, window.innerHeight));
  });
});