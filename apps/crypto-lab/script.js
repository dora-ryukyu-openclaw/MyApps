(function() {
    'use strict';

    const inputData = document.getElementById('input-data');
    const hmacEnabled = document.getElementById('hmac-enabled');
    const hmacKeyContainer = document.getElementById('hmac-key-container');
    const hmacKey = document.getElementById('hmac-key');
    
    const fields = {
        sha256: document.getElementById('hash-sha256'),
        sha512: document.getElementById('hash-sha512'),
        md5: document.getElementById('hash-md5'),
        sha1: document.getElementById('hash-sha1')
    };

    let currentFileContent = null;
    let mode = 'text'; // 'text' | 'file'

    function update() {
        const useHmac = hmacEnabled.checked;
        const key = hmacKey.value;
        const text = mode === 'text' ? inputData.value : currentFileContent;

        if (text === null) return;

        // CryptoJS handles both strings and WordArrays (from typed arrays)
        const data = (mode === 'file') ? CryptoJS.lib.WordArray.create(text) : text;

        if (useHmac) {
            fields.sha256.value = CryptoJS.HmacSHA256(data, key).toString();
            fields.sha512.value = CryptoJS.HmacSHA512(data, key).toString();
            fields.md5.value = CryptoJS.HmacMD5(data, key).toString();
            fields.sha1.value = CryptoJS.HmacSHA1(data, key).toString();
        } else {
            fields.sha256.value = CryptoJS.SHA256(data).toString();
            fields.sha512.value = CryptoJS.SHA512(data).toString();
            fields.md5.value = CryptoJS.MD5(data).toString();
            fields.sha1.value = CryptoJS.SHA1(data).toString();
        }
    }

    inputData.addEventListener('input', update);
    hmacKey.addEventListener('input', update);
    hmacEnabled.addEventListener('change', () => {
        hmacKeyContainer.style.display = hmacEnabled.checked ? 'block' : 'none';
        update();
    });

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            
            btn.classList.add('active');
            mode = btn.dataset.tab;
            document.getElementById(`tab-content-${mode}`).style.display = 'flex';
            update();
        });
    });

    // File Handling
    const fileDrop = document.getElementById('file-drop');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name-display');
    const fileSizeDisplay = document.getElementById('file-size-display');
    const fileInfo = document.getElementById('file-info');

    fileDrop.addEventListener('click', () => fileInput.click());
    
    fileDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDrop.classList.add('dragover');
    });

    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));

    fileDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDrop.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        fileNameDisplay.textContent = file.name;
        fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(2)} KB`;
        fileInfo.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (e) => {
            currentFileContent = e.target.result;
            update();
        };
        reader.readAsArrayBuffer(file);
    }

    // Copy buttons
    document.querySelectorAll('.btn-copy-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const el = document.getElementById(targetId);
            navigator.clipboard.writeText(el.value);
            
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 2000);
        });
    });

    // Initial
    update();

})();
