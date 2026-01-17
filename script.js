const startBtn = document.getElementById('start-btn');
const setupDiv = document.getElementById('setup');
const activeDiv = document.getElementById('active-mode');
const timerDisplay = document.getElementById('timer');
const body = document.body;
const chaosContainer = document.getElementById('chaos-container');

let audioCtx;
let nextTriggerTime = 0;
const INTERVAL = 5000; // 5 seconds

// Aggressive Phrases
const PHRASES = [
    "WORK NOW!",
    "STOP SLACKING!",
    "DO YOUR JOB!",
    "HURRY UP!",
    "NO EXCUSES!",
    "FOCUS!",
    "GENERATE VALUE!",
    "TYPE FASTER!",
    "TIME IS MONEY!",
    "DONT YOU DARE STOP!"
];

startBtn.addEventListener('click', () => {
    // Init Audio Context on user interaction
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Switch UI
    setupDiv.classList.add('hidden');
    activeDiv.classList.remove('hidden');

    // Start Loop
    startLoop();
});

function startLoop() {
    let lastTime = Date.now();
    let timeLeft = 5.0;

    const loop = () => {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        timeLeft -= delta;

        if (timeLeft <= 0) {
            timeLeft = 5.0;
            triggerChaos();
        }

        timerDisplay.textContent = timeLeft.toFixed(1);
        requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
}

function triggerChaos() {
    // 1. AUDIO ASSAULT
    playSiren();
    playVoice();

    // 2. VISUAL ASSAULT
    body.classList.add('chaos-mode');
    document.querySelector('.container').classList.add('shake-active');

    // Spawn random text
    for(let i=0; i<5; i++) {
        spawnFloatingText();
    }

    // Stop chaos after 2 seconds
    setTimeout(() => {
        body.classList.remove('chaos-mode');
        document.querySelector('.container').classList.remove('shake-active');
        chaosContainer.innerHTML = ''; // clear text
    }, 2000);
}

function playSiren() {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
    // Siren effect: glide frequency
    oscillator.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
    oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 1.0);
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Moderate volume to save speakers, but still loud-ish
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
}

function playVoice() {
    const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.5; // Fast
    utterance.pitch = 0.5; // Menacingly low
    utterance.volume = 1.0;
    
    // Try to find a scary voice if possible (English usually has more variety, but we'll try system default)
    const voices = window.speechSynthesis.getVoices();
    // Prefer English for these specific phrases as they are hardcoded in English
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.speak(utterance);
}

function spawnFloatingText() {
    const el = document.createElement('div');
    el.classList.add('floating-text');
    el.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${Math.random() * 5 + 3}rem`; // Random huge size
    el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;

    chaosContainer.appendChild(el);
}
