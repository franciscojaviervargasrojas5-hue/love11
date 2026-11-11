// Frase dividida en palabras
const words = [
  "Te", "amo", "mi", "Frania", 
  "Gracias", "por", "ser", "parte", "de", "mi", "vida", 
  "y", "por", "convertirte", "en", "ella,", 
  "te", "amo", "infinitamente", "yo", "tú", "pancho", 
  "Hasta", "el", "infinito", "y", "más", "allá❤️"
];

let currentWordIndex = 0;
let isMusicStarted = false;

// Elementos del DOM
const gamePhase = document.getElementById('gamePhase');
const finalScreen = document.getElementById('finalScreen');
const phraseBox = document.getElementById('phraseBox');
const mathCard = document.getElementById('mathCard');
const balloonCard = document.getElementById('balloonCard');
const mathProblem = document.getElementById('mathProblem');
const mathAnswer = document.getElementById('mathAnswer');
const checkBtn = document.getElementById('checkBtn');
const balloon = document.getElementById('balloon');
const currentIndexSpan = document.getElementById('currentIndex');
const totalWordsSpan = document.getElementById('totalWords');
const finalMessage = document.getElementById('finalMessage');
const loveSong = document.getElementById('loveSong');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');

totalWordsSpan.textContent = words.length;

// Función para iniciar la música con cualquier primera interacción del usuario
function startMusic() {
  if (!isMusicStarted) {
    loveSong.play().then(() => {
      isMusicStarted = true;
    }).catch(err => {
      console.log("Esperando toque del usuario para audio:", err);
    });
  }
}

// Iniciar música en la primera interacción (clic o tecla)
document.addEventListener('click', startMusic, { once: true });
document.addEventListener('keydown', startMusic, { once: true });

// Generador de sumas de 2 o 3 números que SIEMPRE dan 11
function generateSum() {
  const useThreeNumbers = Math.random() > 0.4;

  if (useThreeNumbers) {
    let a = Math.floor(Math.random() * 7) + 1;
    let b = Math.floor(Math.random() * (9 - a)) + 1; 
    let c = 11 - a - b;
    
    if (c > 9 || c <= 0) {
      return generateSum(); 
    }
    return { problem: `${a} + ${b} + ${c} = ?` };
  } else {
    let a = Math.floor(Math.random() * 7) + 2;
    let b = 11 - a;
    return { problem: `${a} + ${b} = ?` };
  }
}

// Inicializar nueva suma
function loadNextSum() {
  const currentSum = generateSum();
  mathProblem.textContent = currentSum.problem;
  mathAnswer.value = '';
  mathAnswer.focus();
  currentIndexSpan.textContent = currentWordIndex + 1;
}

// Validar respuesta
function checkAnswer() {
  startMusic(); // Garantiza reproducir si hace clic en responder
  const val = parseInt(mathAnswer.value);
  if (val === 11) {
    mathCard.classList.add('hidden');
    balloonCard.classList.remove('hidden');
  } else {
    mathCard.classList.add('shake');
    setTimeout(() => mathCard.classList.remove('shake'), 400);
    mathAnswer.value = '';
    mathAnswer.focus();
  }
}

// Escuchar eventos de validación
checkBtn.addEventListener('click', checkAnswer);
mathAnswer.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

// Reventar globo
balloon.addEventListener('click', () => {
  startMusic();
  const wordChip = document.createElement('span');
  wordChip.className = 'word-chip';
  wordChip.textContent = words[currentWordIndex];
  phraseBox.appendChild(wordChip);

  currentWordIndex++;

  if (currentWordIndex < words.length) {
    balloonCard.classList.add('hidden');
    mathCard.classList.remove('hidden');
    loadNextSum();
  } else {
    showFinalScreen();
  }
});

// Botón pausar / reproducir al final
toggleMusicBtn.addEventListener('click', () => {
  if (loveSong.paused) {
    loveSong.play();
    toggleMusicBtn.textContent = '⏸️ Pausar';
  } else {
    loveSong.pause();
    toggleMusicBtn.textContent = '▶️ Reproducir';
  }
});

// Mostrar pantalla final
function showFinalScreen() {
  gamePhase.classList.add('hidden');
  finalScreen.style.display = 'block';

  const fullText = `Te amo mi Frania

Gracias por ser parte de mi vida y por convertirte en ella, te amo infinitamente yo tú pancho.

Hasta el infinito y más allá ❤️`;
  
  finalMessage.textContent = fullText;
}

// Inicializar primer turno
loadNextSum();

/* ==============================================
   CANVAS: Animación de Rosas y Corazones Flotantes
   ============================================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const particleTypes = ['heart', 'rose'];

class FloatingParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 18 + 12;
    this.speedY = Math.random() * 1.5 + 0.8;
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
    this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    this.opacity = Math.random() * 0.7 + 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.01) * 0.5;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    if (this.type === 'heart') {
      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = '#c9184a';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size / 2, this.size / 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

for (let i = 0; i < 35; i++) {
  particles.push(new FloatingParticle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();
