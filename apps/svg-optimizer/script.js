const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const outputSvg = document.getElementById('output-svg');
const svgPreview = document.getElementById('svg-preview');

const sOriginal = document.getElementById('s-original');
const sOptimized = document.getElementById('s-optimized');
const sSaving = document.getElementById('s-saving');

const btnCopy = document.getElementById('btn-copy');
const btnDownload = document.getElementById('btn-download');

let currentFileName = 'optimized.svg';

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
};

dropZone.ondragleave = () => {
    dropZone.classList.remove('dragover');
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.svg')) {
        processFile(file);
    }
};

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
};

async function processFile(file) {
    currentFileName = file.name.replace('.svg', '.min.svg');
    const text = await file.text();
    const originalSize = file.size;

    try {
        // Using svgo-browser (global svgo)
        const result = await svgo.optimize(text, {
            multipass: true,
            plugins: [
                'preset-default',
                'removeDimensions',
                'sortAttrs'
            ]
        });

        const optimizedText = result.data;
        const optimizedSize = new Blob([optimizedText]).size;

        sOriginal.textContent = formatSize(originalSize);
        sOptimized.textContent = formatSize(optimizedSize);
        
        const saving = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        sSaving.textContent = `-${saving}%`;

        outputSvg.value = optimizedText;
        svgPreview.innerHTML = optimizedText;
        
        resultArea.style.display = 'flex';
    } catch (err) {
        console.error(err);
        alert('SVG の最適化中にエラーが発生しました。');
    }
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

btnCopy.onclick = () => {
    navigator.clipboard.writeText(outputSvg.value);
    const orig = btnCopy.textContent;
    btnCopy.textContent = '完了！';
    setTimeout(() => btnCopy.textContent = orig, 2000);
};

btnDownload.onclick = () => {
    const blob = new Blob([outputSvg.value], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    a.click();
    URL.revokeObjectURL(url);
};
