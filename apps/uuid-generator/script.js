const countIn = document.getElementById('count');
const genBtn = document.getElementById('gen-btn');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copy-btn');

function generateUUID() {
    // Basic crypto based UUID v4
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function update() {
    const count = Math.min(100, Math.max(1, parseInt(countIn.value) || 1));
    let result = '';
    for (let i = 0; i < count; i++) {
        result += generateUUID() + '\n';
    }
    output.value = result.trim();
}

genBtn.onclick = update;

copyBtn.onclick = () => {
    navigator.clipboard.writeText(output.value);
    const orig = copyBtn.textContent;
    copyBtn.textContent = 'コピーしました！';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

update();
