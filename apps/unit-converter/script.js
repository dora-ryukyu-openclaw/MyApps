const rootSize = document.getElementById('root-size');
const vwSize = document.getElementById('vw-size');
const vhSize = document.getElementById('vh-size');

const vPx = document.getElementById('v-px');
const vRem = document.getElementById('v-rem');
const vEm = document.getElementById('v-em');
const vVw = document.getElementById('v-vw');
const vVh = document.getElementById('v-vh');

function update(source) {
    const root = parseFloat(rootSize.value) || 16;
    const vw = parseFloat(vwSize.value) || 1920;
    const vh = parseFloat(vhSize.value) || 1080;

    let px;
    switch (source) {
        case 'px': px = parseFloat(vPx.value); break;
        case 'rem': px = parseFloat(vRem.value) * root; break;
        case 'em': px = parseFloat(vEm.value) * root; break;
        case 'vw': px = (parseFloat(vVw.value) / 100) * vw; break;
        case 'vh': px = (parseFloat(vVh.value) / 100) * vh; break;
    }

    if (isNaN(px)) return;

    if (source !== 'px') vPx.value = px.toFixed(2);
    if (source !== 'rem') vRem.value = (px / root).toFixed(3);
    if (source !== 'em') vEm.value = (px / root).toFixed(3);
    if (source !== 'vw') vVw.value = ((px / vw) * 100).toFixed(3);
    if (source !== 'vh') vVh.value = ((px / vh) * 100).toFixed(3);
}

[vPx, vRem, vEm, vVw, vVh].forEach(el => {
    el.addEventListener('input', () => update(el.id.replace('v-', '')));
});

[rootSize, vwSize, vhSize].forEach(el => {
    el.addEventListener('input', () => update('px'));
});

// Initial
update('px');
