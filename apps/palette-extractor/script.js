const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const sourceImg = document.getElementById('source-img');
const paletteGrid = document.getElementById('palette-grid');
const resultArea = document.getElementById('result-area');

const colorThief = new ColorThief();

dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
};

function processFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        sourceImg.src = e.target.result;
        sourceImg.onload = () => {
            extract();
            resultArea.style.display = 'grid';
        };
    };
    reader.readAsDataURL(file);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function extract() {
    const palette = colorThief.getPalette(sourceImg, 10);
    paletteGrid.innerHTML = '';
    
    palette.forEach(rgb => {
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        const div = document.createElement('div');
        div.className = 'color-swatch';
        div.innerHTML = `
            <div class="color-box" style="background: ${hex}" onclick="copy('${hex}')"></div>
            <div class="color-hex">${hex.toUpperCase()}</div>
        `;
        paletteGrid.appendChild(div);
    });
}

window.copy = (hex) => {
    navigator.clipboard.writeText(hex);
    alert(`Copied: ${hex}`);
};
