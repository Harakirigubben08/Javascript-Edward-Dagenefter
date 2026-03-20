FlyttaImg.src = "EdwardLedsen.jpg"

const SalladImg = new Image();
SalladImg.src = "sallad.png";

let sallader = [];
const antalSallader = 8;
spelare.w = 200;
spelare.h = 200;
spelare.speed = 10;
spelare.x = 60;
spelare.y = 60;

let gameOver = false;
let gameWon = false;
let startTime = null;
const winTime = 15;

function spawnSallader(amount) {
  const margin = 100;

  for (let i = 0; i < amount; i++) {
    let sallad;
    let overlaps;

    do {
      sallad = {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        w: 50,
        h: 50,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8
      };

      const spelareZon = {
        x: spelare.x - margin,
        y: spelare.y - margin,
        w: spelare.w + margin * 2,
        h: spelare.h + margin * 2
      };

      overlaps = rectsCollide(sallad, spelareZon);
    } while (overlaps);

    sallader.push(sallad);
  }
}

function drawsallad(elapsed = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Förlust-skärm
  if (gameOver && !gameWon) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "120px 'woodcraft', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Gunilla vann", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Vinst-skärm
  if (gameWon) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "80px 'woodcraft', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Du undvek nyttigheterna", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Ritar spelaren
  if (FlyttaImg.complete) {
    ctx.drawImage(FlyttaImg, spelare.x, spelare.y, spelare.w, spelare.h);
  }

  // Ritar sallader
  for (let sallad of sallader) {
    if (SalladImg.complete) {
      ctx.drawImage(SalladImg, sallad.x, sallad.y, sallad.w, sallad.h);
    }
  }

  // ⏱️ Timer uppe i vänstra hörnet
  const timeLeft = Math.max(0, winTime - Math.floor(elapsed));
  ctx.fillStyle = "black";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`⏱ ${timeLeft}s`, 20, 20);
}

function updatesallad() {
  if (gameOver || gameWon) return;

  // Vinst efter 15 sekunder
  if (startTime !== null && (Date.now() - startTime) / 1000 >= winTime) {
    gameWon = true;
    return;
  }

  // Flyttar spelaren
  if (keys["ArrowLeft"])  spelare.x -= spelare.speed;
  if (keys["ArrowRight"]) spelare.x += spelare.speed;
  if (keys["ArrowUp"])    spelare.y -= spelare.speed;
  if (keys["ArrowDown"])  spelare.y += spelare.speed;

  spelare.x = Math.max(0, Math.min(canvas.width - spelare.w, spelare.x));
  spelare.y = Math.max(0, Math.min(canvas.height - spelare.h, spelare.y));

  // Sallad som flyger 🦅
  for (let sallad of sallader) {
    sallad.x += sallad.vx;
    sallad.y += sallad.vy;

    if (sallad.x <= 0 || sallad.x + sallad.w >= canvas.width) {
      sallad.vx *= -1;
    }
    if (sallad.y <= 0 || sallad.y + sallad.h >= canvas.height) {
      sallad.vy *= -1;
    }
  }

  // Kollar om salladen träffar
  for (let i = sallader.length - 1; i >= 0; i--) {
    if (rectsCollide(spelare, sallader[i])) {
      gameOver = true;
      break;
    }
  }
}

function gameLoop() {
  if (startTime === null) startTime = Date.now();
  const elapsed = (Date.now() - startTime) / 1000;

  updatesallad();
  drawsallad(elapsed);
  requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    spawnSallader(antalSallader);
    gameLoop();
  }
}

FlyttaImg.onload = imageLoaded;
SalladImg.onload = imageLoaded;

setTimeout(() => {
  if (imagesLoaded < 2) {
    spawnSallader(antalSallader);
    gameLoop();
  }
}, 1500);