// Tabs
const swTab = document.getElementById('tab-stopwatch');
const tmTab = document.getElementById('tab-timer');
const swView = document.getElementById('stopwatch-view');
const tmView = document.getElementById('timer-view');

swTab.onclick = () => {
    swTab.classList.add('active'); tmTab.classList.remove('active');
    swView.classList.remove('hidden'); tmView.classList.add('hidden');
};
tmTab.onclick = () => {
    tmTab.classList.add('active'); swTab.classList.remove('active');
    tmView.classList.remove('hidden'); swView.classList.add('hidden');
};

// Stopwatch
let swTime = 0;
let swInterval = null;
const swDisplay = document.getElementById('sw-display');
const swStartBtn = document.getElementById('sw-start');
const swLapBtn = document.getElementById('sw-lap');
const swResetBtn = document.getElementById('sw-reset');
const swLaps = document.getElementById('sw-laps');

function formatTime(ms) {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cent = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
}

swStartBtn.onclick = () => {
    if (swInterval) {
        clearInterval(swInterval);
        swInterval = null;
        swStartBtn.textContent = 'スタート';
        swLapBtn.disabled = true;
    } else {
        const start = Date.now() - swTime;
        swInterval = setInterval(() => {
            swTime = Date.now() - start;
            swDisplay.textContent = formatTime(swTime);
        }, 10);
        swStartBtn.textContent = 'ストップ';
        swLapBtn.disabled = false;
    }
};

swLapBtn.onclick = () => {
    const div = document.createElement('div');
    div.className = 'lap-item';
    div.innerHTML = `<span>Lap ${swLaps.children.length + 1}</span> <span>${formatTime(swTime)}</span>`;
    swLaps.prepend(div);
};

swResetBtn.onclick = () => {
    clearInterval(swInterval);
    swInterval = null;
    swTime = 0;
    swDisplay.textContent = '00:00.00';
    swStartBtn.textContent = 'スタート';
    swLapBtn.disabled = true;
    swLaps.innerHTML = '';
};

// Timer
let tmTime = 600; // default 10min
let tmInterval = null;
const tmDisplay = document.getElementById('tm-display');
const tmMinIn = document.getElementById('tm-min');
const tmSecIn = document.getElementById('tm-sec');
const tmStartBtn = document.getElementById('tm-start');
const tmResetBtn = document.getElementById('tm-reset');

function formatTimer(s) {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
}

tmStartBtn.onclick = () => {
    if (tmInterval) {
        clearInterval(tmInterval);
        tmInterval = null;
        tmStartBtn.textContent = 'スタート';
    } else {
        if (tmTime <= 0) {
            tmTime = parseInt(tmMinIn.value) * 60 + parseInt(tmSecIn.value);
        }
        tmInterval = setInterval(() => {
            tmTime--;
            tmDisplay.textContent = formatTimer(tmTime);
            if (tmTime <= 0) {
                clearInterval(tmInterval);
                tmInterval = null;
                tmStartBtn.textContent = 'スタート';
                alert('タイマー終了！');
            }
        }, 1000);
        tmStartBtn.textContent = 'ストップ';
    }
};

tmResetBtn.onclick = () => {
    clearInterval(tmInterval);
    tmInterval = null;
    tmTime = parseInt(tmMinIn.value) * 60 + parseInt(tmSecIn.value);
    tmDisplay.textContent = formatTimer(tmTime);
    tmStartBtn.textContent = 'スタート';
};

tmMinIn.oninput = tmSecIn.oninput = () => {
    if (!tmInterval) {
        tmTime = parseInt(tmMinIn.value) * 60 + parseInt(tmSecIn.value);
        tmDisplay.textContent = formatTimer(tmTime);
    }
};
