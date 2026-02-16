const target = document.getElementById('target-shape');
const slidersList = document.getElementById('sliders-list');
const cssCode = document.getElementById('css-code');
const copyBtn = document.getElementById('copy-code');

let vals = [50, 50, 50, 50, 50, 50, 50, 50];
const labels = [
    'Top Left (H)', 'Top Right (H)', 'Bottom Right (H)', 'Bottom Left (H)',
    'Top Left (V)', 'Top Right (V)', 'Bottom Right (V)', 'Bottom Left (V)'
];

function renderSliders() {
    slidersList.innerHTML = '';
    vals.forEach((v, i) => {
        const div = document.createElement('div');
        div.className = 'slider-row';
        div.innerHTML = `
            <label>${labels[i]}: ${v}%</label>
            <input type="range" min="0" max="100" value="${v}" oninput="updateVal(${i}, this.value)">
        `;
        slidersList.appendChild(div);
    });
}

window.updateVal = (i, v) => {
    vals[i] = v;
    renderSliders();
    update();
};

function update() {
    // border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
    const br = `${vals[0]}% ${vals[1]}% ${vals[2]}% ${vals[3]}% / ${vals[4]}% ${vals[5]}% ${vals[6]}% ${vals[7]}%`;
    target.style.borderRadius = br;
    cssCode.textContent = `border-radius: ${br};`;
}

copyBtn.onclick = () => {
    navigator.clipboard.writeText(cssCode.textContent);
    const orig = copyBtn.textContent;
    copyBtn.textContent = 'Done!';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

renderSliders();
update();
