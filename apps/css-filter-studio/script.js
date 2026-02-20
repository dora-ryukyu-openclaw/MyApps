(function() {
    'use strict';

    const previewImg = document.getElementById('preview-img');
    const fileInput = document.getElementById('file-input');
    const btnUpload = document.getElementById('btn-upload');
    const btnDownload = document.getElementById('btn-download');
    const btnReset = document.getElementById('btn-reset');
    const btnCopy = document.getElementById('btn-copy');
    const cssOutput = document.getElementById('css-output');
    const slidersList = document.getElementById('filter-sliders');
    const presetBtns = document.querySelectorAll('.preset-btn');

    const filters = {
        brightness: { val: 100, unit: '%', min: 0, max: 200 },
        contrast: { val: 100, unit: '%', min: 0, max: 200 },
        saturate: { val: 100, unit: '%', min: 0, max: 200 },
        grayscale: { val: 0, unit: '%', min: 0, max: 100 },
        sepia: { val: 0, unit: '%', min: 0, max: 100 },
        blur: { val: 0, unit: 'px', min: 0, max: 20 },
        hueRotate: { val: 0, unit: 'deg', min: 0, max: 360, name: 'hue-rotate' },
        invert: { val: 0, unit: '%', min: 0, max: 100 }
    };

    const presets = {
        none: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 0 },
        grayscale: { grayscale: 100 },
        sepia: { sepia: 100 },
        vintage: { sepia: 50, contrast: 120, brightness: 90, saturate: 80 },
        dreamy: { blur: 2, brightness: 110, saturate: 130 },
        noir: { grayscale: 100, contrast: 150, brightness: 80 }
    };

    function initSliders() {
        slidersList.innerHTML = '';
        Object.keys(filters).forEach(key => {
            const f = filters[key];
            const group = document.createElement('div');
            group.className = 'slider-group';
            group.innerHTML = `
                <div class="slider-header">
                    <label>${f.name || key}</label>
                    <span id="v-${key}">${f.val}${f.unit}</span>
                </div>
                <input type="range" id="s-${key}" min="${f.min}" max="${f.max}" value="${f.val}">
            `;
            slidersList.appendChild(group);
            
            const input = group.querySelector('input');
            input.addEventListener('input', () => {
                f.val = input.value;
                document.getElementById(`v-${key}`).textContent = `${f.val}${f.unit}`;
                updateFilters();
            });
        });
    }

    function updateFilters() {
        let filterStr = '';
        Object.keys(filters).forEach(key => {
            const f = filters[key];
            if (f.val != (key === 'blur' || key === 'grayscale' || key === 'sepia' || key === 'hueRotate' || key === 'invert' ? 0 : 100)) {
                filterStr += `${f.name || key}(${f.val}${f.unit}) `;
            }
        });
        
        filterStr = filterStr.trim() || 'none';
        previewImg.style.filter = filterStr;
        cssOutput.textContent = `filter: ${filterStr};`;
    }

    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                btnDownload.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    btnReset.addEventListener('click', () => applyPreset('none'));

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });

    function applyPreset(name) {
        const p = presets[name];
        const defaults = presets['none'];
        Object.keys(filters).forEach(key => {
            const val = p[key] !== undefined ? p[key] : defaults[key];
            filters[key].val = val;
            const input = document.getElementById(`s-${key}`);
            if (input) {
                input.value = val;
                document.getElementById(`v-${key}`).textContent = `${val}${filters[key].unit}`;
            }
        });
        updateFilters();
    }

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(cssOutput.textContent);
        const original = btnCopy.innerHTML;
        btnCopy.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => btnCopy.innerHTML = original, 2000);
    });

    btnDownload.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = previewImg.style.filter;
            ctx.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'filtered-image.png';
            a.click();
        };
        img.src = previewImg.src;
    });

    // Init
    initSliders();
    updateFilters();

})();
