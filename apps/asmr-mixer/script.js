let audioCtx = null;
const masterBtn = document.getElementById('master-toggle');
const sliders = document.querySelectorAll('.vol-slider');

const sounds = {
    white: null,
    rain: null,
    wind: null,
    fire: null
};

function createWhiteNoise() {
    const bufferSize = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const noiseBuffer = createWhiteNoise();

    Object.keys(sounds).forEach(key => {
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;

        let filter = null;
        if (key === 'rain') {
            filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            source.connect(filter).connect(gainNode);
        } else if (key === 'wind') {
            filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 500;
            filter.Q.value = 1;
            source.connect(filter).connect(gainNode);
        } else if (key === 'fire') {
            filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            source.connect(filter).connect(gainNode);
        } else {
            source.connect(gainNode);
        }

        gainNode.connect(audioCtx.destination);
        source.start();
        sounds[key] = gainNode;
    });
}

masterBtn.onclick = () => {
    if (!audioCtx) {
        initAudio();
        masterBtn.textContent = 'Audio Active';
        masterBtn.classList.add('btn-secondary');
        masterBtn.disabled = true;
    }
};

sliders.forEach(slider => {
    slider.oninput = (e) => {
        if (!audioCtx) return;
        const key = e.target.dataset.sound;
        const val = parseFloat(e.target.value);
        if (sounds[key]) {
            sounds[key].gain.setTargetAtTime(val, audioCtx.currentTime, 0.1);
        }
    };
});
