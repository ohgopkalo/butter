window.addEventListener("DOMContentLoaded", () => {

  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");

  if (!stage || !bread || !knife) return;

  // ----- НІЖ = курсор
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

  // ----- ХЛІБ (спокійний DVD-рух)

  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  let vx = 0.9;   // повільний рух
  let vy = 0.7;

  function animate(){

    const half = bread.offsetWidth / 2;

    const minX = half;
    const maxX = window.innerWidth - half;
    const minY = half;
    const maxY = window.innerHeight - half;

    // спокійний рух
    bx += vx;
    by += vy;

    // відбивання від країв
    if (bx <= minX || bx >= maxX) vx *= -1;
    if (by <= minY || by >= maxY) vy *= -1;

    // реакція на ніж
    const dx = bx - mx;
    const dy = by - my;
    const dist = Math.hypot(dx, dy);

    const panicRadius = 150;
    const fleeSpeed = 2.5; // трохи швидше ніж базовий

    if (dist < panicRadius){
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);

      vx = nx * fleeSpeed;
      vy = ny * fleeSpeed;
    }

    bread.style.left = bx + "px";
    bread.style.top  = by + "px";

    requestAnimationFrame(animate);
  }

  animate();
});