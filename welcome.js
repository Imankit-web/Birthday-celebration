/* ===== WELCOME JS ===== */

const stage1 = document.getElementById('stage-1');
const stage2 = document.getElementById('stage-2');
const trigger = document.getElementById('entry-trigger');
const cakeVideo = document.getElementById('cake-video');
const celebrationSound = document.getElementById('celebration-sound');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

// Stage Transitions
trigger.addEventListener('click', () => {
    // 1. Force play immediately (even if hidden) to catch the user gesture
    cakeVideo.play().catch(err => console.log("Playback failed:", err));

    // 2. Fade out Stage 1
    stage1.classList.add('hidden');

    // 3. Prepare and Show Stage 2
    setTimeout(() => {
        stage2.classList.remove('hidden');

        // Start floating balloons
        startBalloons();

        // 4. Stage 2 logic (5 seconds)
        setTimeout(() => {
            // Blow out the candle
            const candle = document.getElementById('candle-overlay');
            if (candle) candle.classList.add('blown-out');

            // Trigger Confetti & Sound
            celebrationSound.play().catch(() => { });
            launchConfetti();

            // 5. Final Transition to Main Website
            setTimeout(() => {
                stage2.classList.add('hidden');
                setTimeout(() => {
                    window.location.href = 'birthday.html';
                }, 1500); // Wait for fade out
            }, 3000); // Duration to enjoy confetti before redirect

        }, 5000); // 5 seconds of candle blowing
    }, 1000); // Wait for Stage 1 fade out
});

/* ===== FLOATING SPARKLES BACKGROUND ===== */
const particleContainer = document.getElementById('particles');

function createSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = Math.random() * 4 + 2;
    s.style.width = s.style.height = `${size}px`;
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    s.style.animationDuration = (Math.random() * 2 + 2) + 's';
    particleContainer.appendChild(s);
    setTimeout(() => s.remove(), 3000);
}

setInterval(createSparkle, 150);

/* ===== CONFETTI ANIMATION ===== */
let confettis = [];
let animating = false;

function launchConfetti() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 200; i++) {
        confettis.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above
            r: Math.random() * 6 + 4,
            d: Math.random() * 200, // Density
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    if (!animating) {
        animating = true;
        drawConfetti();
    }
}

function drawConfetti() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettis.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncremental;
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.tilt = Math.sin(c.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 5);
        ctx.stroke();
    });

    updateConfetti();
    requestAnimationFrame(drawConfetti);
}

function updateConfetti() {
    confettis.forEach((c, i) => {
        // If it goes off screen bottom
        if (c.y > canvas.height) {
            confettis.splice(i, 1);
        }
    });

    if (confettis.length === 0) {
        animating = false;
    }
}

// Window Resize for Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/* ===== BALLOONS ANIMATION ===== */
function startBalloons() {
    const container = document.getElementById('balloons-container');
    const colors = ['#ff66a3', '#ff85a1', '#ffb3c6', '#ffccd5', '#f78fa7'];

    // Create multiple balloons over time
    let balloonCount = 0;
    const interval = setInterval(() => {
        if (balloonCount > 25) { // Stop after 25 balloons start
            clearInterval(interval);
            return;
        }
        createBalloon(container, colors);
        balloonCount++;
    }, 300); // New balloon every 300ms
}

function createBalloon(container, colors) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    // Randomize properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    const left = Math.random() * 90; // 0% to 90%
    const duration = Math.random() * 3 + 5; // 5s to 8s

    balloon.style.backgroundColor = color;
    balloon.style.left = left + '%';
    balloon.style.transform = `scale(${size})`;
    balloon.style.animationDuration = duration + 's';

    // We need to set the triangle color to match
    // since ::before pseudo elements can't easily inherit inline background color in older CSS without variables.
    // Instead of inline styles for before, we'll set a CSS variable.
    balloon.style.setProperty('--balloon-color', color);

    container.appendChild(balloon);

    // Remove balloon after it's done
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.parentNode.removeChild(balloon);
        }
    }, duration * 1000);
}

