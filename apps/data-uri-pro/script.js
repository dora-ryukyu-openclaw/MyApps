const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultArea = document.getElementById('result-area');
const previewImg = document.getElementById('preview-img');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');

const cRaw = document.getElementById('c-raw');
const cCss = document.getElementById('c-css');
const cHtml = document.getElementById('c-html');

const dropText = document.getElementById('drop-text');

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
    dropText.textContent = '放してアップロード';
};

dropZone.ondragleave = () => {
    dropZone.classList.remove('dragover');
    dropText.textContent = '画像をドラッグ＆ドロップ、またはクリックして選択';
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    dropText.textContent = '画像をドラッグ＆ドロップ、またはクリックして選択';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    }
};

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
};

function processFile(file) {
    dropText.textContent = '処理中...';
    dropZone.style.opacity = '0.6';
    dropZone.style.pointerEvents = 'none';

    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUri = e.target.result;
        previewImg.src = dataUri;
        
        cRaw.value = dataUri;
        cCss.value = `background-image: url("${dataUri}");`;
        cHtml.value = `<img src="${dataUri}" alt="${file.name}">`;
        
        resultArea.style.display = 'grid';
        dropText.textContent = '画像をドラッグ＆ドロップ、またはクリックして選択';
        dropZone.style.opacity = '1';
        dropZone.style.pointerEvents = 'auto';
    };
    reader.readAsDataURL(file);
}

document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.onclick = () => {
        const targetId = btn.dataset.target;
        const textarea = document.getElementById(targetId);
        navigator.clipboard.writeText(textarea.value);
        
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    };
});
