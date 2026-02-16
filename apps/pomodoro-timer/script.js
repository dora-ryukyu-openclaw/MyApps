const display = document.getElementById('display');
const progress = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

let timeLeft = 1500;
let totalTime = 1500;
let timerInterval = null;

const CIRCUM = 2 * Math.PI * 45;
progress.style.strokeDasharray = CIRCUM;

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    const offset = CIRCUM - (timeLeft / totalTime) * CIRCUM;
    progress.style.strokeDashoffset = offset;
}

startBtn.onclick = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = 'スタート';
    } else {
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'スタート';
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
};

modeBtns.forEach(btn => {
    btn.onclick = () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        totalTime = timeLeft = parseInt(btn.dataset.time);
        resetBtn.click();
    };
});

updateDisplay();
