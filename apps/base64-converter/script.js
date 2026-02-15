document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const btnEncode = document.getElementById('btn-encode');
    const btnDecode = document.getElementById('btn-decode');
    const btnSwap = document.getElementById('btn-swap');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');

    // UTF-8 aware Base64 encode
    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    // UTF-8 aware Base64 decode
    function b64DecodeUnicode(str) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    function encode() {
        try {
            const raw = inputText.value;
            if (!raw) {
                outputText.value = '';
                return;
            }
            outputText.value = b64EncodeUnicode(raw);
        } catch (e) {
            outputText.value = 'Error: ' + e.message;
        }
    }

    function decode() {
        try {
            const raw = inputText.value.trim(); // Remove whitespace
            if (!raw) {
                outputText.value = '';
                return;
            }
            // Basic cleanup for loose base64
            const clean = raw.replace(/\s/g, '');
            outputText.value = b64DecodeUnicode(clean);
        } catch (e) {
            outputText.value = 'Error: Invalid Base64 string.\n' + e.message;
        }
    }

    btnEncode.addEventListener('click', encode);
    btnDecode.addEventListener('click', decode);

    btnSwap.addEventListener('click', () => {
        const currentInput = inputText.value;
        const currentOutput = outputText.value;
        
        inputText.value = currentOutput;
        outputText.value = currentInput; // Swap content directly
    });

    btnClear.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    });

    btnCopy.addEventListener('click', async () => {
        if (!outputText.value) return;
        try {
            await navigator.clipboard.writeText(outputText.value);
            const original = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => btnCopy.textContent = original, 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    });
    
    // Auto-resize disabled (using fixed layout)
});
