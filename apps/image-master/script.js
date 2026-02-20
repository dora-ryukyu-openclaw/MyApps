(function() {
    'use strict';

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('download-btn');
    
    // Controls
    const wInput = document.getElementById('w-px');
    const hInput = document.getElementById('h-px');
    const keepRatio = document.getElementById('keep-ratio');
    const qualityInput = document.getElementById('quality');
    const qualityVal = document.getElementById('quality-val');
    const exportFormat = document.getElementById('export-format');
    
    // Filters
    const fBrightness = document.getElementById('f-brightness');
    const fContrast = document.getElementById('f-contrast');
    const fSaturate = document.getElementById('f-saturate');

    let originalImg = null;
    let originalWidth = 0;
    let originalHeight = 0;

    // Initialization
    dropZone.onclick = () => fileInput.click();
    
    dropZone.ondragover = (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    };
    dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    };

    fileInput.onchange = (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    };

    function handleFile(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImg = new Image();
            originalImg.onload = () => {
                originalWidth = originalImg.width;
                originalHeight = originalImg.height;
                
                wInput.value = originalWidth;
                hInput.value = originalHeight;
                
                canvas.style.display = 'block';
                dropZone.style.display = 'none';
                downloadBtn.disabled = false;
                
                render();
            };
            originalImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function render() {
        if (!originalImg) return;
        
        const w = parseInt(wInput.value) || 1;
        const h = parseInt(hInput.value) || 1;
        
        canvas.width = w;
        canvas.height = h;
        
        ctx.clearRect(0, 0, w, h);
        
        // Apply filters to context
        ctx.filter = `brightness(${fBrightness.value}%) contrast(${fContrast.value}%) saturate(${fSaturate.value}%)`;
        
        ctx.drawImage(originalImg, 0, 0, w, h);
        
        // Reset filter
        ctx.filter = 'none';
    }

    // Event Listeners for controls
    [wInput, hInput, fBrightness, fContrast, fSaturate].forEach(el => {
        el.addEventListener('input', (e) => {
            if (e.target === wInput && keepRatio.checked) {
                hInput.value = Math.round(wInput.value * (originalHeight / originalWidth));
            } else if (e.target === hInput && keepRatio.checked) {
                wInput.value = Math.round(hInput.value * (originalWidth / originalHeight));
            }
            
            // Update labels
            if (el.id.startsWith('f-')) {
                document.getElementById(el.id + '-val').textContent = el.value + '%';
            }
            
            render();
        });
    });

    qualityInput.addEventListener('input', () => {
        qualityVal.textContent = qualityInput.value + '%';
    });

    downloadBtn.addEventListener('click', () => {
        const quality = parseInt(qualityInput.value) / 100;
        const format = exportFormat.value;
        const ext = format.split('/')[1].replace('jpeg', 'jpg');
        
        const dataUrl = canvas.toDataURL(format, quality);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `processed_image.${ext}`;
        a.click();
        
        // Visual feedback
        const originalText = downloadBtn.innerHTML;
        downloadBtn.textContent = '保存完了！';
        setTimeout(() => downloadBtn.innerHTML = originalText, 2000);
    });

})();
