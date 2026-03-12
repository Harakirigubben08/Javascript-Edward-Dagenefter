const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const div = document.getElementById("slutskärm")

const FlyttaImg = new Image();
FlyttaImg.src = "trött.jpg";

const kåldolmeImg = document.getElementById("dolm");




let spelare = {
  x: 100,
  y: 100,
  w: 180,
  h: 160,
  speed: 25
};

let keys = {};

window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

let coins = [];
let score = 0;
const maxCoins = 5;

function spawnCoins(amount) {
  for (let i = 0; i < amount; i++) {
    coins.push({
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      w: 55,
      h: 55
    });
  }
}

spawnCoins(maxCoins);

function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update() {
  if (keys["ArrowLeft"])  spelare.x -= spelare.speed;
  if (keys["ArrowRight"]) spelare.x += spelare.speed;
  if (keys["ArrowUp"])    spelare.y -= spelare.speed;
  if (keys["ArrowDown"])  spelare.y += spelare.speed;

  spelare.x = Math.max(0, Math.min(canvas.width - spelare.w, spelare.x));
  spelare.y = Math.max(0, Math.min(canvas.height - spelare.h, spelare.y));

  coins = coins.filter((coin) => {
    if (rectsCollide(spelare, coin)) {
      score++;
      if (score<120){
      spelare.w += 2;
      spelare.h += 2;

      }

      return false;
    }
    return true;
  });

  if (score>50){
    FlyttaImg.src = "Edwardglad.jpg";
  };
    
  if (coins.length < maxCoins) {
    spawnCoins(maxCoins - coins.length);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(FlyttaImg, spelare.x, spelare.y, spelare.w, spelare.h);

  for (let coin of coins) {
    ctx.drawImage(kåldolmeImg, coin.x, coin.y, coin.w, coin.h);
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Kåldolmar: " + score, 10, 25);
}

function gameLoop() {
  update();
  draw();
  id = requestAnimationFrame(gameLoop);
  if(score > 10){
    cancelAnimationFrame(id);
    canvas.style.display = 'none';
    div.style.display = "flex";
  }
}

let loaded = 0;
function onLoad() {
  loaded++;
  if (loaded === 2) gameLoop();
}

FlyttaImg.onload = onLoad;
kåldolmeImg.onload = onLoad;
if (kåldolmeImg.complete) onLoad();