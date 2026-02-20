(function() {
    'use strict';

    // State
    let timer = null;
    let timeLeft = 1500;
    let currentMode = 'work'; // 'work' | 'break' | 'long'
    let isRunning = false;
    let sessionCount = 0;

    // Settings
    let config = {
        work: 25,
        break: 5,
        long: 15,
        autoCycle: true,
        sound: true,
        longBreakInterval: 4
    };

    // DOM Elements
    const displayTime = document.getElementById('display-time');
    const displayStatus = document.getElementById('display-status');
    const progressBar = document.getElementById('progress-bar');
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const btnSettings = document.getElementById('btn-settings');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // Settings DOM
    const overlay = document.getElementById('settings-overlay');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const setWork = document.getElementById('set-work');
    const setBreak = document.getElementById('set-break');
    const setLong = document.getElementById('set-long');
    const setAutoCycle = document.getElementById('set-auto-cycle');
    const setSound = document.getElementById('set-sound');

    // Constants
    const CIRCUMFERENCE = 816.81; // 2 * PI * 130
    progressBar.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;

    function updateDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        displayTime.textContent = timeStr;
        
        const emoji = currentMode === 'work' ? '🔥' : '☕';
        document.title = `${emoji} ${timeStr} - ポモドーロタイマー`;

        const totalTime = config[currentMode] * 60;
        const progress = timeLeft / totalTime;
        const offset = CIRCUMFERENCE * (1 - progress);
        progressBar.style.strokeDashoffset = offset;
    }

    function playChime() {
        if (!config.sound) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            const now = ctx.currentTime;
            
            // 和音っぽい心地よい音
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.5); // E5
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
            
            osc.start(now);
            osc.stop(now + 1.0);
        } catch (e) { console.error(e); }
    }

    function switchMode(mode, startImmediately = false) {
        clearInterval(timer);
        isRunning = false;
        currentMode = mode;
        timeLeft = config[mode] * 60;
        
        modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
        
        const statusMap = {
            work: 'FOCUS',
            break: 'SHORT BREAK',
            long: 'LONG BREAK'
        };
        displayStatus.textContent = statusMap[mode];
        
        // Colors for depth 2.0
        const colorMap = {
            work: '#ef4444',
            break: '#10b981',
            long: '#3b82f6'
        };
        const color = colorMap[mode];
        document.documentElement.style.setProperty('--c-accent', color);
        document.documentElement.style.setProperty('--c-accent-glow', color + '66');
        progressBar.style.stroke = color;
        
        updateDisplay();
        updateStartBtn();

        if (startImmediately) {
            startTimer();
        }
    }

    function updateStartBtn() {
        if (isRunning) {
            btnStart.classList.add('btn-secondary');
            btnStart.classList.remove('btn-primary');
            btnStart.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/></svg> PAUSE`;
        } else {
            btnStart.classList.add('btn-primary');
            btnStart.classList.remove('btn-secondary');
            btnStart.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> START`;
        }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        updateStartBtn();
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                completeCycle();
            }
        }, 1000);
    }

    function completeCycle() {
        playChime();
        
        if (currentMode === 'work') {
            sessionCount++;
            if (sessionCount % config.longBreakInterval === 0) {
                switchMode('long', config.autoCycle);
            } else {
                switchMode('break', config.autoCycle);
            }
        } else {
            switchMode('work', config.autoCycle);
        }
        
        if (!config.autoCycle) {
            alert('Time is up!');
        }
    }

    btnStart.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            updateStartBtn();
        } else {
            startTimer();
        }
    });

    btnReset.addEventListener('click', () => {
        if (confirm('タイマーをリセットしますか？')) {
            switchMode(currentMode);
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isRunning) {
                if (confirm('タイマーを停止してモードを切り替えますか？')) {
                    switchMode(btn.dataset.mode);
                }
            } else {
                switchMode(btn.dataset.mode);
            }
        });
    });

    // Settings Modal
    btnSettings.addEventListener('click', () => {
        setWork.value = config.work;
        setBreak.value = config.break;
        setLong.value = config.long;
        setAutoCycle.checked = config.autoCycle;
        setSound.checked = config.sound;
        overlay.style.display = 'flex';
    });

    btnCloseSettings.addEventListener('click', () => overlay.style.display = 'none');
    
    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
    });

    btnSaveSettings.addEventListener('click', () => {
        config.work = Math.max(1, parseInt(setWork.value) || 25);
        config.break = Math.max(1, parseInt(setBreak.value) || 5);
        config.long = Math.max(1, parseInt(setLong.value) || 15);
        config.autoCycle = setAutoCycle.checked;
        config.sound = setSound.checked;
        
        localStorage.setItem('myapps-pomodoro-config', JSON.stringify(config));
        overlay.style.display = 'none';
        
        // Reset current timer with new settings
        switchMode(currentMode);
    });

    // Load Config
    try {
        const saved = localStorage.getItem('myapps-pomodoro-config');
        if (saved) {
            const parsed = JSON.parse(saved);
            config = { ...config, ...parsed };
        }
    } catch (e) { console.error('Failed to load config', e); }

    // Init
    switchMode('work');

})();
