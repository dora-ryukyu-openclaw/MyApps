const target = document.getElementById('target-box');
const layersList = document.getElementById('layers-list');
const addLayerBtn = document.getElementById('add-layer');
const cssCode = document.getElementById('css-code');
const copyBtn = document.getElementById('copy-code');
const canvas = document.querySelector('.preview-canvas');

const bgBtn = document.getElementById('change-bg');
const boxBtn = document.getElementById('change-box');

let layers = [
    { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1 },
    { x: 0, y: 2, blur: 4, spread: -1, color: '#000000', opacity: 0.06 }
];

const bgColors = ['#f8fafc', '#1e293b', '#6366f1', '#ffffff'];
const boxColors = ['#ffffff', '#f8fafc', '#e2e8f0', '#1e293b'];
let bgIdx = 0;
let boxIdx = 0;

function renderLayers() {
    layersList.innerHTML = '';
    layers.forEach((layer, idx) => {
        const div = document.createElement('div');
        div.className = 'layer-card';
        div.innerHTML = `
            <div class="layer-header">
                <span>LAYER ${idx + 1}</span>
                <button class="btn-remove" onclick="removeLayer(${idx})" style="border:none;background:none;cursor:pointer;color:var(--c-error)">×</button>
            </div>
            ${slider(idx, 'x', 'X Offset', -50, 50)}
            ${slider(idx, 'y', 'Y Offset', -50, 50)}
            ${slider(idx, 'blur', 'Blur', 0, 100)}
            ${slider(idx, 'spread', 'Spread', -50, 50)}
            ${slider(idx, 'opacity', 'Opacity', 0, 1, 0.01)}
        `;
        layersList.appendChild(div);
    });
    update();
}

function slider(idx, prop, label, min, max, step = 1) {
    return `
        <div class="slider-group">
            <label>${label}</label>
            <input type="range" min="${min}" max="${max}" step="${step}" value="${layers[idx][prop]}" oninput="updateLayer(${idx}, '${prop}', this.value)">
            <span>${layers[idx][prop]}</span>
        </div>
    `;
}

window.updateLayer = (idx, prop, val) => {
    layers[idx][prop] = parseFloat(val);
    renderLayers();
};

window.removeLayer = (idx) => {
    layers.splice(idx, 1);
    renderLayers();
};

addLayerBtn.onclick = () => {
    layers.push({ x: 0, y: 10, blur: 15, spread: 0, color: '#000000', opacity: 0.1 });
    renderLayers();
};

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function update() {
    const shadowStr = layers.map(l => 
        `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`
    ).join(',\n  ');
    
    target.style.boxShadow = shadowStr;
    cssCode.textContent = `box-shadow: ${shadowStr};`;
}

bgBtn.onclick = () => {
    bgIdx = (bgIdx + 1) % bgColors.length;
    canvas.style.background = bgColors[bgIdx];
};

boxBtn.onclick = () => {
    boxIdx = (boxIdx + 1) % boxColors.length;
    target.style.background = boxColors[boxIdx];
};

copyBtn.onclick = () => {
    navigator.clipboard.writeText(cssCode.textContent);
    const orig = copyBtn.textContent;
    copyBtn.textContent = '完了！';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

renderLayers();
