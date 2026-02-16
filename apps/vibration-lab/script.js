const customIn = document.getElementById('custom-v');
const customBtn = document.getElementById('btn-custom');
const jsCode = document.getElementById('js-code');

function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
        jsCode.textContent = `navigator.vibrate(${JSON.stringify(pattern)});`;
    } else {
        alert('このブラウザは Vibration API をサポートしていません。');
    }
}

customBtn.onclick = () => {
    const val = customIn.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (val.length > 0) {
        vibrate(val);
    }
};

window.vibrate = vibrate;
