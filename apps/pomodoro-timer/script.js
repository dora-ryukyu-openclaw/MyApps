const display = document.getElementById('display');
const progress = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

const statusText = document.getElementById('status-text');

let timeLeft = 1500;
let totalTime = 1500;
let timerInterval = null;

const CIRCUM = 2 * Math.PI * 45;
progress.style.strokeDasharray = CIRCUM;
progress.style.strokeDashoffset = 0;

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    display.textContent = timeStr;
    document.title = `${timeStr} - ポモドーロタイマー`;
    
    const ratio = totalTime > 0 ? timeLeft / totalTime : 0;
    const offset = CIRCUM - ratio * CIRCUM;
    progress.style.strokeDashoffset = offset;
}

startBtn.onclick = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = '再開する';
        statusText.textContent = 'PAUSED';
    } else {
        statusText.textContent = 'FOCUSING';
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'スタート';
                statusText.textContent = 'FINISHED';
                alert('時間です！');
            }
        }, 1000);
        startBtn.textContent = 'ストップ';
    }
};

resetBtn.onclick = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = totalTime;
    updateDisplay();
    startBtn.textContent = 'スタート';
    statusText.textContent = 'READY';
};

modeBtns.forEach(btn => {
    btn.onclick = () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        totalTime = timeLeft = parseInt(btn.dataset.time);
        const isBreak = btn.id === 'mode-break';
        statusText.textContent = isBreak ? 'REST' : 'READY';
        resetBtn.click();
        
        // Update accent color dynamically?
        document.documentElement.style.setProperty('--c-accent', isBreak ? '#10b981' : '#ef4444');
    };
});

updateDisplay();
