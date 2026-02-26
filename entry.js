/* ===== ENTRY JS ===== */

const trigger = document.getElementById('entry-trigger');
const popSound = document.getElementById('pop-sound');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

trigger.addEventListener('click', () => {
    // Play sound
    popSound.play().catch(() => { });

    // Launch Confetti
    launchConfetti();

    // Show Loader after a tiny delay
    setTimeout(() => {
        document.getElementById('loader').classList.add('active');
        document.querySelector('.entry-container').classList.add('fade-out');
    }, 500);

    // Redirect
    setTimeout(() => {
        window.location.href = 'birthday.html';
    }, 3500); // Extended delay for loader
});

/* ===== SIMPLE CONFETTI ===== */
let confettis = [];
let animating = false;

function launchConfetti() {
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 150; i++) {
        confettis.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            r: 4 + Math.random() * 6,
            color: ['#FAD0C4', '#FFD1FF', '#FFFFFF', '#EC407A'][Math.floor(Math.random() * 4)],
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1) * 15,
            gravity: 0.3
        });
    }

    if (!animating) {
        animating = true;
        animateConfetti();
    }
}

function animateConfetti() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettis.forEach((c, i) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();

        if (c.y > canvas.height) confettis.splice(i, 1);
    });

    if (confettis.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        animating = false;
    }
}

/* ===== FLOATING SPARKLES BACKGROUND ===== */
const particleContainer = document.getElementById('particles');

function createSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.width = s.style.height = (2 + Math.random() * 5) + 'px';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    particleContainer.appendChild(s);
    setTimeout(() => s.remove(), 3000);
}

setInterval(createSparkle, 300);
