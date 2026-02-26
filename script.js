function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function rand(min, max){ return min + Math.random() * (max - min); }

window.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("stage");
  const bread = document.getElementById("bread");
  const knife = document.getElementById("knife");
  if (!stage || !bread || !knife) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  let bx = window.innerWidth / 2;
  let by = window.innerHeight / 2;

  let vx = rand(-0.5, 0.5);
  let vy = rand(-0.5, 0.5);

  let targetX = rand(0.2, 0.8) * window.innerWidth;
  let targetY = rand(0.2, 0.8) * window.innerHeight;
  let timer = 0;

  function setKnife(x, y){
    mx = x;
    my = y;
    knife.style.left = x + "px";
    knife.style.top  = y + "px";
  }

  stage.addEventListener("mousemove", (e)=>{
    setKnife(e.clientX,
