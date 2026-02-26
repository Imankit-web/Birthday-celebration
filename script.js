/* ===== 3D TILT EFFECT ===== */
function initTilt(element) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

document.querySelectorAll('.photo-card, .special-card').forEach(initTilt);

/* ============================================================

   BIRTHDAY SURPRISE WEBSITE — script.js
   ============================================================ */

/* ===== FLOATING PARTICLES ===== */
const particleContainer = document.getElementById('particles');
const symbols = ['💖', '🌸', '✨', '💫', '🌷', '💕', '⭐', '🦋', '🌺', '💗'];

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');
  p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  p.style.animationDuration = (8 + Math.random() * 12) + 's';
  p.style.animationDelay = (Math.random() * 5) + 's';
  particleContainer.appendChild(p);
  setTimeout(() => p.remove(), 20000);
}

setInterval(createParticle, 600);
for (let i = 0; i < 10; i++) setTimeout(createParticle, i * 300);


/* ===== BACKGROUND MUSIC ===== */
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('bg-music');
let playing = false;

musicBtn.addEventListener('click', () => {
  /* If no <source> has been added yet, guide the user */
  if (!audio.src && !audio.querySelector('source')) {
    alert('🎵 To add background music, insert a\n<source src="your-song.mp3" type="audio/mpeg">\ninside the <audio> tag in index.html!');
    return;
  }
  if (playing) {
    audio.pause();
    musicBtn.textContent = '🎵';
  } else {
    audio.play();
    musicBtn.textContent = '⏸️';
  }
  playing = !playing;
});


/* ===== LIGHTBOX ===== */
function openLightbox(card) {
  const lb = document.getElementById('lightbox');
  const container = document.getElementById('lightbox-img-container');
  const img = card.querySelector('img');
  const ph = card.querySelector('.photo-placeholder');

  container.innerHTML = '';

  if (img) {
    const clone = img.cloneNode();
    clone.id = 'lightbox-img';
    clone.style.borderRadius = '20px';
    container.appendChild(clone);
  } else if (ph) {
    const div = document.createElement('div');
    div.style.cssText =
      'width:400px;height:400px;display:flex;align-items:center;justify-content:center;' +
      'font-size:5rem;background:linear-gradient(135deg,#F7C5D0,#D8C5E8);border-radius:20px;';
    div.textContent = ph.textContent.charAt(0);
    container.appendChild(div);
  }

  lb.classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

/* Close lightbox on backdrop click */
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});


/* ===== SCROLL REVEAL (Intersection Observer) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.special-card').forEach((card, i) => {
  card.dataset.delay = i * 100;
  revealObserver.observe(card);
});

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.dataset.delay = i * 150;
  revealObserver.observe(item);
});


/* ===== LETTER — TYPING ANIMATION ===== */
/* ✏️  Edit this text to personalise the letter */
const letterText = `Today feels special not just because it’s your birthday, but because it reminds me that the world became a little brighter the day you were born.

While writing this, I keep thinking about all our random conversations that turned into hours, the jokes only we understand, the times we laughed so much we couldn’t breathe. I think about the small moments too — the comfortable silences, the way you pretend to be mad, the way your smile slowly appears when you try not to laugh.

I remember the days you were strong for everyone else, even when things weren’t easy for you. I remember the times you doubted yourself, not realizing how incredible you already were. And I remember how naturally you became part of my everyday life — like you were always meant to be there.

You’ve been there in my happiest moments and my quietest ones. You’ve heard my nonsense, my dreams, my overthinking — and stayed. That means more than I can explain.

If today brings you even half the warmth you’ve brought into my life, then it will be a perfect day.

Here’s to more memories, more laughter, more late-night talks, and more moments that one day we’ll look back on and smile.`;

let letterStarted = false;
const letterEl = document.getElementById('letter-text');
const cursor = document.createElement('span');
cursor.className = 'cursor';

function typeWriter(text, el, speed = 18) {
  el.textContent = '';
  el.appendChild(cursor);
  let i = 0;

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(() => (cursor.style.display = 'none'), 2000);
    }
  }

  type();
}

const letterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !letterStarted) {
    letterStarted = true;
    typeWriter(letterText, letterEl, 18);
  }
}, { threshold: 0.3 });

letterObserver.observe(document.getElementById('letter'));


/* ===== LETTER DATE — auto-fill today's date ===== */
const now = new Date();
document.getElementById('letter-date').textContent = now.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});


/* ===== CONFETTI ===== */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettis = [];
let animating = false;

const confettiColors = [
  '#F7C5D0', '#E8899A', '#D8C5E8', '#B89ED0',
  '#F5D5C0', '#E8B898', '#E8C878', '#ffffff'
];

function launchConfetti() {
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  confettis = [];

  for (let i = 0; i < 200; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      r: 4 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? 'heart' : 'circle'
    });
  }

  if (!animating) { animating = true; animateConfetti(); }

  setTimeout(() => {
    canvas.style.display = 'none';
    animating = false;
    confettis = [];
  }, 5000);
}

function animateConfetti() {
  if (!animating) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettis.forEach(c => {
    c.x += c.vx;
    c.y += c.vy;
    c.rotation += c.vr;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    ctx.fillStyle = c.color;

    if (c.shape === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, -c.r * 0.5);
      ctx.bezierCurveTo(c.r, -(c.r * 1.5), c.r * 2, c.r * 0.5, 0, c.r * 1.5);
      ctx.bezierCurveTo(-c.r * 2, c.r * 0.5, -c.r, -(c.r * 1.5), 0, -c.r * 0.5);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, c.r, c.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  requestAnimationFrame(animateConfetti);
}

