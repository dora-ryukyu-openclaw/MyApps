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

    function update() {
        const text = inputData.value;
        const key = hmacKey.value;
        const useHmac = hmacEnabled.checked;

        if (useHmac) {
            fields.sha256.value = CryptoJS.HmacSHA256(text, key).toString();
            fields.sha512.value = CryptoJS.HmacSHA512(text, key).toString();
            fields.md5.value = CryptoJS.HmacMD5(text, key).toString();
            fields.sha1.value = CryptoJS.HmacSHA1(text, key).toString();
        } else {
            fields.sha256.value = CryptoJS.SHA256(text).toString();
            fields.sha512.value = CryptoJS.SHA512(text).toString();
            fields.md5.value = CryptoJS.MD5(text).toString();
            fields.sha1.value = CryptoJS.SHA1(text).toString();
        }
    }

    inputData.addEventListener('input', update);
    hmacKey.addEventListener('input', update);
    hmacEnabled.addEventListener('change', () => {
        hmacKeyContainer.style.display = hmacEnabled.checked ? 'block' : 'none';
        update();
    });

    // Copy buttons
    document.querySelectorAll('.btn-copy-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const el = document.getElementById(targetId);
            navigator.clipboard.writeText(el.value);
            
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = original, 2000);
        });
    });

    // Initial
    update();

})();
