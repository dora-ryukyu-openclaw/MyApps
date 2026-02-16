const wIn = document.getElementById('w');
const hIn = document.getElementById('h');
const grayscaleIn = document.getElementById('grayscale');
const blurIn = document.getElementById('blur');
const btnGen = document.getElementById('btn-gen');
const previewImg = document.getElementById('preview-img');
const urlOutput = document.getElementById('url-output');
const copyUrl = document.getElementById('copy-url');

function update() {
    const w = wIn.value || 800;
    const h = hIn.value || 600;
    let url = `https://picsum.photos/${w}/${h}`;
    
    const params = [];
    if (grayscaleIn.checked) params.push('grayscale');
    if (blurIn.value > 0) params.push(`blur=${blurIn.value}`);
    
    if (params.length) {
        url += `?${params.join('&')}`;
    }

    urlOutput.value = url;
    previewImg.src = url;
}

btnGen.onclick = update;

copyUrl.onclick = () => {
    navigator.clipboard.writeText(urlOutput.value);
    const orig = copyUrl.textContent;
    copyUrl.textContent = 'Done!';
    setTimeout(() => copyUrl.textContent = orig, 2000);
};

update();
