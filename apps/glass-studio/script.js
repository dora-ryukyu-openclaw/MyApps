const glass = document.getElementById('glass-preview');
const cssOutput = document.getElementById('css-code');
const copyBtn = document.getElementById('copy-css');

const inputs = {
    opacity: document.getElementById('opacity'),
    blur: document.getElementById('blur'),
    color: document.getElementById('color'),
    radius: document.getElementById('radius'),
    borderOpacity: document.getElementById('border-opacity')
};

const bgBtn = document.getElementById('change-bg');
const previewBg = document.querySelector('.preview-bg');

const gradients = [
    'linear-gradient(135deg, #f472b6 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80")'
];
let bgIndex = 0;

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function update() {
    const opacity = inputs.opacity.value;
    const blur = inputs.blur.value;
    const color = inputs.color.value;
    const radius = inputs.radius.value;
    const borderOpacity = inputs.borderOpacity.value;

    const bgColor = hexToRgba(color, opacity);
    const borderColor = hexToRgba('#ffffff', borderOpacity);

    const styles = {
        background: bgColor,
        backdropFilter: `blur(${blur}px)`,
        webkitBackdropFilter: `blur(${blur}px)`,
        borderRadius: `${radius}px`,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    };

    Object.assign(glass.style, styles);

    const cssText = `background: ${bgColor};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: 1px solid ${borderColor};
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;

    cssOutput.textContent = cssText;
}

bgBtn.addEventListener('click', () => {
    bgIndex = (bgIndex + 1) % gradients.length;
    previewBg.style.background = gradients[bgIndex];
    if (gradients[bgIndex].startsWith('url')) {
        previewBg.style.backgroundSize = 'cover';
        previewBg.style.backgroundPosition = 'center';
    }
});

Object.values(inputs).forEach(input => {
    input.addEventListener('input', update);
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '完了！';
    setTimeout(() => copyBtn.textContent = originalText, 2000);
});

update();
