console.log("hejsan")
FlyttaImg.src = "EdwardLedsen.jpg"

const SalladImg = new Image();
SalladImg.src = "sallad.png";
seconds=0;
let sallader = [];
const antalSallader = 4;
spelare.w = 200
spelare.h = 200
spelare.speed = 10
spelare.x = 60
spelare.y= 60

let gameOver = false;

//skapar sallad
function spawnSallader(amount) {
  for (let i = 0; i < amount; i++) {
    const sallad = {
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height - 50),
      w: 50,
      h: 50,
      vx: (Math.random() - 0.5) * 3,   
      vy: (Math.random() - 0.5) * 3
    };
    sallader.push(sallad);
  }
}

function drawsallad() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "120px 'woodcraft', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Gunilla vann", canvas.width/2, canvas.height/2);

    return;
  }

  // Rita spelaren
  if (FlyttaImg.complete) {
    ctx.drawImage(FlyttaImg, spelare.x, spelare.y, spelare.w, spelare.h);
  }

  // Rita sallader
  for (let sallad of sallader) {
    if (SalladImg.complete) {
      ctx.drawImage(SalladImg, sallad.x, sallad.y, sallad.w, sallad.h);
    }
  }
}


function updatesallad() {
  if (gameOver) return;

  // Flytta spelaren
  if (keys["ArrowLeft"])  spelare.x -= spelare.speed;
  if (keys["ArrowRight"]) spelare.x += spelare.speed;
  if (keys["ArrowUp"])    spelare.y -= spelare.speed;
  if (keys["ArrowDown"])  spelare.y += spelare.speed;


  spelare.x = Math.max(0, Math.min(canvas.width - spelare.w, spelare.x));
  spelare.y = Math.max(0, Math.min(canvas.height - spelare.h, spelare.y));

  // sallad som flyger
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

  // Kollar om salladen träffar
  for (let i = sallader.length - 1; i >= 0; i--) {
    if (rectsCollide(spelare, sallader[i])) {
      gameOver = true;
      break; 
    }
  }
}

function gameLoop(start) {
    now = new Date().getSeconds()/100;
    distance = start - now;
    if (distance > 1){
      seconds ++;
    }
  console.log(seconds);
  updatesallad();
  drawsallad();
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
SalladImg.onload  = imageLoaded;

setTimeout(() => {
  if (imagesLoaded === 2) {
    spawnSallader(antalSallader);
    start = new Date().getSeconds();
    gameLoop(start);
  }
}, 1500);

setTimeout(() => {

  
}, 10000);