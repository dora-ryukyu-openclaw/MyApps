(function() {
    'use strict';

    const colorPicker = document.getElementById('color-picker');
    const hexVal = document.getElementById('hex-val');
    const rgbVal = document.getElementById('rgb-val');
    const bgPicker = document.getElementById('bg-picker');
    const contrastPreview = document.getElementById('contrast-preview');
    const previewText = contrastPreview.querySelector('.preview-text');
    const contrastRatio = document.getElementById('contrast-ratio');
    const wcagAA = document.getElementById('wcag-aa');
    const wcagAAA = document.getElementById('wcag-aaa');
    const paletteGrid = document.getElementById('palette-grid');
    const btnRegen = document.getElementById('btn-regen');

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return {r, g, b};
    }

    function luminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function calculateContrast(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const l1 = luminance(rgb1.r, rgb1.g, rgb1.b) + 0.05;
        const l2 = luminance(rgb2.r, rgb2.g, rgb2.b) + 0.05;
        return l1 > l2 ? l1 / l2 : l2 / l1;
    }

    function update() {
        const color = colorPicker.value;
        const bgColor = bgPicker.value;
        const rgb = hexToRgb(color);

        hexVal.value = color.toUpperCase();
        rgbVal.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        // Contrast
        contrastPreview.style.background = bgColor;
        previewText.style.color = color;
        
        const ratio = calculateContrast(color, bgColor);
        contrastRatio.textContent = ratio.toFixed(1) + ':1';
        
        wcagAA.textContent = ratio >= 4.5 ? 'Pass' : 'Fail';
        wcagAA.className = 'status-badge ' + (ratio >= 4.5 ? 'pass' : 'fail');
        
        wcagAAA.textContent = ratio >= 7 ? 'Pass' : 'Fail';
        wcagAAA.className = 'status-badge ' + (ratio >= 7 ? 'pass' : 'fail');
    }

    function generatePalette() {
        paletteGrid.innerHTML = '';
        const baseColor = colorPicker.value;
        const rgb = hexToRgb(baseColor);
        
        // Generate variations
        const variations = [
            baseColor,
            adjustColor(rgb, 20),
            adjustColor(rgb, -20),
            adjustColor(rgb, 40),
            complementary(rgb)
        ];

        variations.forEach(hex => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            item.innerHTML = `
                <div class="palette-color" style="background: ${hex}"></div>
                <div class="palette-hex">${hex.toUpperCase()}</div>
            `;
            item.addEventListener('click', () => {
                colorPicker.value = hex;
                update();
            });
            paletteGrid.appendChild(item);
        });
    }

    function adjustColor({r, g, b}, amount) {
        const f = (v) => Math.max(0, Math.min(255, v + amount)).toString(16).padStart(2, '0');
        return `#${f(r)}${f(g)}${f(b)}`;
    }

    function complementary({r, g, b}) {
        const f = (v) => (255 - v).toString(16).padStart(2, '0');
        return `#${f(r)}${f(g)}${f(b)}`;
    }

    colorPicker.addEventListener('input', () => { update(); generatePalette(); });
    bgPicker.addEventListener('input', update);
    hexVal.addEventListener('change', () => {
        if (/^#[0-9A-F]{6}$/i.test(hexVal.value)) {
            colorPicker.value = hexVal.value;
            update();
            generatePalette();
        }
    });

    btnRegen.addEventListener('click', () => {
        const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        colorPicker.value = randomHex;
        update();
        generatePalette();
    });

    // Initial
    update();
    generatePalette();

})();
