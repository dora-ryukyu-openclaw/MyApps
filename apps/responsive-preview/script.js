const urlInput = document.getElementById('url-input');
const btnLoad = document.getElementById('btn-load');
const targetFrame = document.getElementById('target-frame');
const deviceFrame = document.getElementById('device-frame');
const frameInfo = document.getElementById('frame-info');
const customW = document.getElementById('custom-w');
const customH = document.getElementById('custom-h');
const deviceBtns = document.querySelectorAll('.device-btn');

function updateSize(w, h, label) {
    deviceFrame.style.width = `${w}px`;
    deviceFrame.style.height = `${h}px`;
    frameInfo.textContent = `${w} × ${h} (${label})`;
    customW.value = w;
    customH.value = h;
}

function loadUrl() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    targetFrame.src = url;
}

deviceBtns.forEach(btn => {
    btn.onclick = () => {
        deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSize(btn.dataset.w, btn.dataset.h, btn.textContent);
    };
});

[customW, customH].forEach(input => {
    input.oninput = () => {
        deviceBtns.forEach(b => b.classList.remove('active'));
        updateSize(customW.value, customH.value, 'Custom');
    };
});

btnLoad.onclick = loadUrl;
urlInput.onkeypress = (e) => {
    if (e.key === 'Enter') loadUrl();
};

// Initial state
updateSize(375, 667, 'Mobile');
loadUrl();
