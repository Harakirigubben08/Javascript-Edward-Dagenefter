// Förutsättning: du har redan canvas, ctx och keys definierade någonstans
// Exempel:
// const canvas = document.getElementById("game");
// const ctx = canvas.getContext("2d");
// let keys = {};

const FlyttaImg = new Image();
FlyttaImg.src = "edwardLedsen.jpg";   // byt namn om filen heter något annat

const SalladImg = new Image();
SalladImg.src = "sallad.png";

let sallader = [];
const antalSallader = 4;

let spelare = {
  x: 200,
  y: 200,
  w: 60,
  h: 80,
  speed: 5
};

let gameOver = false;

// ====================
//     Skapa sallader
// ====================
function spawnSallader(amount) {
  for (let i = 0; i < amount; i++) {
    const sallad = {
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height - 50),
      w: 50,
      h: 50,
      vx: (Math.random() - 0.5) * 3,   // -1.5 till +1.5 px/frame
      vy: (Math.random() - 0.5) * 3
    };
    sallader.push(sallad);
  }
}

// ====================
//     Kollisionsdetektering
// ====================
function rectsCollide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// ====================
//     Rita allt
// ====================
function drawsallad() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    // Svart skärm + text
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "120px 'Woodcraft', cursive";  // Woodcraft måste vara laddad
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Gunilla vann", canvas.width/2, canvas.height/2);

    return;
  }

  // Rita spelaren
  if (FlyttaImg.complete) {
    ctx.drawImage(FlyttaImg, spelare.x, spelare.y, spelare.w, spelare.h);
  }

  // Rita alla sallader
  for (let sallad of sallader) {
    if (SalladImg.complete) {
      ctx.drawImage(SalladImg, sallad.x, sallad.y, sallad.w, sallad.h);
    }
  }
}

// ====================
//     Uppdatera logik
// ====================
function updatesallad() {
  if (gameOver) return;

  // Flytta spelaren
  if (keys["ArrowLeft"])  spelare.x -= spelare.speed;
  if (keys["ArrowRight"]) spelare.x += spelare.speed;
  if (keys["ArrowUp"])    spelare.y -= spelare.speed;
  if (keys["ArrowDown"])  spelare.y += spelare.speed;

  // Håll spelaren inne på canvas
  spelare.x = Math.max(0, Math.min(canvas.width - spelare.w, spelare.x));
  spelare.y = Math.max(0, Math.min(canvas.height - spelare.h, spelare.y));

  // Flytta salladerna (de flyger runt)
  for (let sallad of sallader) {
    sallad.x += sallad.vx;
    sallad.y += sallad.vy;

    // Studsa mot kanterna
    if (sallad.x <= 0 || sallad.x + sallad.w >= canvas.width) {
      sallad.vx *= -1;
    }
    if (sallad.y <= 0 || sallad.y + sallad.h >= canvas.height) {
      sallad.vy *= -1;
    }
  }

  // Kolla kollision med varje sallad
  for (let i = sallader.length - 1; i >= 0; i--) {
    if (rectsCollide(spelare, sallader[i])) {
      gameOver = true;
      // Du kan också ta bort salladen om du vill:
      // sallader.splice(i, 1);
      break; // vi behöver bara en kollision för game over
    }
  }
}

// ====================
//     Spel-loop
// ====================
function gameLoop() {
  updatesallad();
  drawsallad();
  requestAnimationFrame(gameLoop);
}

// Starta spelet när båda bilderna är laddade
let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    spawnSallader(antalSallader);
    gameLoop();
  }
}

FlyttaImg.onload = imageLoaded;
SalladImg.onload  = imageLoaded;

// Om bilderna redan är cachade → onload triggas inte alltid
// Säkerhetskontroll:
setTimeout(() => {
  if (imagesLoaded === 2) {
    spawnSallader(antalSallader);
    gameLoop();
  }
}, 1500);