const img = document.getElementById('preview-img');
const sliders = document.getElementById('sliders');
const cssCode = document.getElementById('css-code');
const fileIn = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');

const filterConfig = [
    { name: 'blur', label: 'ぼかし', min: 0, max: 20, unit: 'px', default: 0 },
    { name: 'brightness', label: '明るさ', min: 0, max: 200, unit: '%', default: 100 },
    { name: 'contrast', label: 'コントラスト', min: 0, max: 200, unit: '%', default: 100 },
    { name: 'grayscale', label: 'グレースケール', min: 0, max: 100, unit: '%', default: 0 },
    { name: 'hue-rotate', label: '色相回転', min: 0, max: 360, unit: 'deg', default: 0 },
    { name: 'invert', label: '反転', min: 0, max: 100, unit: '%', default: 0 },
    { name: 'opacity', label: '不透明度', min: 0, max: 100, unit: '%', default: 100 },
    { name: 'saturate', label: '彩度', min: 0, max: 200, unit: '%', default: 100 },
    { name: 'sepia', label: 'セピア', min: 0, max: 100, unit: '%', default: 0 }
];

let state = {};
filterConfig.forEach(f => state[f.name] = f.default);

function renderSliders() {
    sliders.innerHTML = '';
    filterConfig.forEach(f => {
        const div = document.createElement('div');
        div.className = 'slider-group';
        div.innerHTML = `
            <div class="slider-header">
                <label>${f.label}</label>
                <span>${state[f.name]}${f.unit}</span>
            </div>
            <input type="range" min="${f.min}" max="${f.max}" value="${state[f.name]}" oninput="updateFilter('${f.name}', this.value)">
        `;
        sliders.appendChild(div);
    });
}

window.updateFilter = (name, val) => {
    state[name] = val;
    renderSliders();
    update();
};

function update() {
    const filterStr = filterConfig
        .map(f => {
            if (state[f.name] === f.default) return '';
            return `${f.name}(${state[f.name]}${f.unit})`;
        })
        .filter(Boolean)
        .join(' ');
    
    const final = filterStr || 'none';
    img.style.filter = final;
    cssCode.textContent = `filter: ${final};`;
}

uploadBtn.onclick = () => fileIn.click();
fileIn.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => img.src = ev.target.result;
        reader.readAsDataURL(file);
    }
};

resetBtn.onclick = () => {
    filterConfig.forEach(f => state[f.name] = f.default);
    renderSliders();
    update();
};

copyBtn.onclick = () => {
    navigator.clipboard.writeText(cssCode.textContent);
    const orig = copyBtn.textContent;
    copyBtn.textContent = '完了！';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

renderSliders();
update();
