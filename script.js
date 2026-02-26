window.addEventListener("DOMContentLoaded", () => {
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");
  if (!bread || !knife) return;

  // ніж = курсор (працює стабільно в embed)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    knife.style.left = mx + "px";
    knife.style.top  = my + "px";
  });

  // старт
  knife.style.left = mx + "px";
  knife.style.top  = my + "px";

  // хліб
  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  // базова швидкість (твій “cloud” вайб)
  const baseSpeed = 0.9;
  let vx = baseSpeed;
  let vy = baseSpeed * 0.75;

  // параметри страху
  const fearRadius = 300;   // з якої відстані починає боятися
  const maxBoost  = 4;    // максимально у скільки разів прискорюється
  const steer     = 0.10;   // наскільки “керується” від ножа (м’якість)

  function animate() {
    const half = bread.offsetWidth / 2;

    const minX = half;
    const maxX = window.innerWidth - half;
    const minY = half;
    const maxY = window.innerHeight - half;

    // напрямок від ножа
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy) || 1;

    // 0..1 (1 = дуже близько)
    const fear = Math.max(0, 1 - dist / fearRadius);

    // цільова швидкість: базова + плавний буст
    const targetSpeed = baseSpeed * (1 + fear * maxBoost);

    // бажаний напрямок: трошки “підрулює” від ножа + лишається інерція
    const nx = dx / dist;
    const ny = dy / dist;

    // плавно підтягуємо vx/vy до “втечі”
    vx += (nx * targetSpeed - vx) * steer;
    vy += (ny * targetSpeed - vy) * steer;

    // рух
    bx += vx;
    by += vy;

    // відбивання від країв (м’яке)
    if (bx < minX) { bx = minX; vx = Math.abs(vx); }
    if (bx > maxX) { bx = maxX; vx = -Math.abs(vx); }
    if (by < minY) { by = minY; vy = Math.abs(vy); }
    if (by > maxY) { by = maxY; vy = -Math.abs(vy); }

    bread.style.left = bx + "px";
    bread.style.top  = by + "px";

    requestAnimationFrame(animate);
  }

  animate();
});
