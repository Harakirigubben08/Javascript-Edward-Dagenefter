const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const div = document.getElementById("slutskärm")

const FlyttaImg = new Image();
FlyttaImg.src = "trött.jpg";

let id;
const kåldolmeImg = new Image();
kåldolmeImg.src = "dolme.jpg";

function byttillsallad(){
  const gammal = document.querySelector('script[data-role="game.js"]')
  canvas.style.display = 'flex'
  div.style.display = 'none'
  console.log("Maaa")
  if (gammal) gammal.remove();
  const sallad = document.createElement('script');
  sallad.src = 'sallad.js';
  sallad.setAttribute('data-role','game');
  document.head.appendChild(sallad);
}




let spelare = {
  x: 100,
  y: 100,
  w: 180,
  h: 160,
  speed: 15
};

let keys = []

let dolmar = [];
let score = 0;
const maxdolmar = 5;

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function spawndolmar(amount) {
  for (let i = 0; i < amount; i++) {
    dolmar.push({
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      w: 55,
      h: 55
    });
  }
}

spawndolmar(maxdolmar);

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

  dolmar = dolmar.filter((dolm) => {
    if (rectsCollide(spelare, dolm)) {
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
    FlyttaImg.src = "Edwardgap.jpg";
  };
    
  if (dolmar.length < maxdolmar) {
    spawndolmar(maxdolmar - dolmar.length);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(FlyttaImg, spelare.x, spelare.y, spelare.w, spelare.h);

  for (let dolm of dolmar) {
    ctx.drawImage(kåldolmeImg, dolm.x, dolm.y, dolm.w, dolm.h);
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Kåldolmar: " + score, 10, 25);
}

function gameLoop() {
  update();
  draw();
  id = requestAnimationFrame(gameLoop);
  if(score > 20){
    cancelAnimationFrame(id);
    canvas.style.display = 'none';
    div.style.display = "flex";
    setTimeout(() =>{
    byttillsallad()
    console.log("potatis")

    }, 3*1000 );

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