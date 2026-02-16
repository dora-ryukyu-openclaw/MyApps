(function() {
    'use strict';

    const display = document.getElementById('password-display');
    const btnCopy = document.getElementById('btn-copy');
    const btnRegen = document.getElementById('btn-regen');
    const lengthRange = document.getElementById('length-range');
    const lengthNum = document.getElementById('length-num');
    const checkUpper = document.getElementById('check-upper');
    const checkLower = document.getElementById('check-lower');
    const checkNumbers = document.getElementById('check-numbers');
    const checkSymbols = document.getElementById('check-symbols');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const entropyText = document.getElementById('entropy-text');

    const CHARSETS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    function generate() {
        let chars = '';
        let poolSize = 0;
        if (checkUpper.checked) { chars += CHARSETS.upper; poolSize += CHARSETS.upper.length; }
        if (checkLower.checked) { chars += CHARSETS.lower; poolSize += CHARSETS.lower.length; }
        if (checkNumbers.checked) { chars += CHARSETS.numbers; poolSize += CHARSETS.numbers.length; }
        if (checkSymbols.checked) { chars += CHARSETS.symbols; poolSize += CHARSETS.symbols.length; }

        if (chars === '') {
            display.textContent = '(選択してください)';
            updateStrength(0, 0);
            return;
        }

        const length = parseInt(lengthNum.value);
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(array[i] % chars.length);
        }

        display.textContent = password;
        
        // Entropy calculation: L * log2(N)
        const entropy = length * Math.log2(poolSize);
        updateStrength(entropy, length);
    }

    function updateStrength(entropy, length) {
        entropyText.textContent = `${Math.round(entropy)} bits`;
        
        let score = Math.min(entropy / 100, 1) * 100;
        strengthBar.style.width = `${score}%`;

        if (entropy < 40) {
            strengthBar.style.background = '#ef4444';
            strengthText.textContent = '非常に弱い';
        } else if (entropy < 60) {
            strengthBar.style.background = '#f59e0b';
            strengthText.textContent = '弱い';
        } else if (entropy < 80) {
            strengthBar.style.background = '#fbbf24';
            strengthText.textContent = '普通';
        } else if (entropy < 100) {
            strengthBar.style.background = '#10b981';
            strengthText.textContent = '強い';
        } else {
            strengthBar.style.background = '#059669';
            strengthText.textContent = '非常に強力';
        }
    }

    // Event Listeners
    [lengthRange, lengthNum, checkUpper, checkLower, checkNumbers, checkSymbols].forEach(el => {
        el.addEventListener('input', (e) => {
            if (e.target === lengthRange) lengthNum.value = lengthRange.value;
            if (e.target === lengthNum) lengthRange.value = lengthNum.value;
            generate();
        });
    });

    btnRegen.addEventListener('click', generate);

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(display.textContent);
        const original = btnCopy.textContent;
        btnCopy.textContent = 'コピー完了！';
        setTimeout(() => btnCopy.textContent = original, 2000);
    });

    // Initial
    generate();

})();
