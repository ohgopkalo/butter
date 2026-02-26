window.addEventListener("DOMContentLoaded", () => {
  const pet = document.querySelector(".pet");
  if (!pet) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;

  let vx = (Math.random() - 0.5) * 1.2; // швидкість по X
  let vy = (Math.random() - 0.
