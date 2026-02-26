function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function rand(min, max){ return min + Math.random() * (max - min); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");
  if (!stage || !bread || !knife) return;

  // Knife (cursor) position
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  // Bread position & velocity
  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;
  let vx = rand(-0.6, 0.6);
  let vy = rand(-0.6, 0.6);

  // wandering target (для “симпатичного плавання”)
  let tx = rand(0.2, 0.8) * window.innerWidth;
  let ty = rand(0.2, 0.8) * window.innerHeight;
  let targetTimer = 0;

  function setKnifePos(x, y){
    mx = x; my = y;
    knife.style.left = `${mx}px`;
    knife.style.top  = `${my}px`;
  }

  stage.addEventListener("mousemove", (e) => setKnifePos(e.clientX, e.clientY));
  stage.addEventListener("touchmove", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    setKnifePos(t.clientX, t.clientY);
  }, { passive: true });

  // стартова позиція ножа
  setKnifePos(mx, my);

  function step(){
    // межі з урахуванням розміру хліба
    const rect = bread.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    // 1) “плавання” до випадкової цілі
    targetTimer += 1;
    if (targetTimer > 240){ // раз на ~4 сек при 60fps
      targetTimer = 0;
      tx = rand(0.1, 0.9) * window.innerWidth;
      ty = rand(0.1, 0.9) * window.innerHeight;
    }

    // легенько тягне в сторону цілі
    vx += (tx - bx) * 0.0006;
    vy += (ty - by) * 0.0006;

    // 2) тікає від ножа, коли близько
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy);

    const fleeRadius = 140;     // наскільки близько — починає тікати
    const fleeForce  = 0.06;    // сила втечі

    if (dist < fleeRadius){
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      const strength = (1 - dist / fleeRadius) * fleeForce;
      vx += nx * strength;
      vy += ny * strength;
    }

    // 3) демпфування, щоб було “акуратненько”
    vx *= 0.985;
    vy *= 0.985;

    // обмеження швидкості
    const maxSpeed = 2.2;
    const sp = Math.hypot(vx, vy);
    if (sp > maxSpeed){
      vx = (vx / sp) * maxSpeed;
      vy = (vy / sp) * maxSpeed;
    }

    // рух
    bx += vx;
    by += vy;

    // відбивання від країв
    const minX = halfW, maxX = window.innerWidth - halfW;
    const minY = halfH, maxY = window.innerHeight - halfH;

    if (bx < minX){ bx = minX; vx *= -0.9; }
    if (bx > maxX){ bx = maxX; vx *= -0.9; }
    if (by < minY){ by = minY; vy *= -0.9; }
    if (by > maxY){ by = maxY; vy *= -0.9; }

    bread.style.left = `${bx}px`;
    bread.style.top  = `${by}px`;

    requestAnimationFrame(step);
  }

  step();

  window.addEventListener("resize", () => {
    bx = clamp(bx, 0, window.innerWidth);
    by = clamp(by, 0, window.innerHeight);
    setKnifePos(clamp(mx, 0, window.innerWidth), clamp(my, 0, window.innerHeight));
  });
});
