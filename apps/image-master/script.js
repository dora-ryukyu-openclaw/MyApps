(function() {
    'use strict';

    const inputImage = document.getElementById('input-image');
    const btnOpen = document.getElementById('btn-open');
    const btnSave = document.getElementById('btn-save');
    const previewImage = document.getElementById('preview-image');
    const dropZone = document.getElementById('drop-zone');
    const ratioBtns = document.querySelectorAll('.btn-ratio');
    const outWidth = document.getElementById('out-width');
    const outHeight = document.getElementById('out-height');
    const outFormat = document.getElementById('out-format');

    let cropper = null;

    // Open File
    btnOpen.addEventListener('click', () => inputImage.click());

    inputImage.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            loadImage(e.target.files[0]);
        }
    });

    // Drag & Drop
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            loadImage(e.dataTransfer.files[0]);
        }
    });

    function loadImage(file) {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            dropZone.style.display = 'none';
            btnSave.disabled = false;

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(previewImage, {
                viewMode: 1,
                autoCropArea: 1,
                ready() {
                    const data = cropper.getCanvasData();
                    outWidth.value = Math.round(data.naturalWidth);
                    outHeight.value = Math.round(data.naturalHeight);
                }
            });
        };
        reader.readAsDataURL(file);
    }

    // Aspect Ratio
    ratioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ratioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const ratio = parseFloat(btn.dataset.ratio);
            if (cropper) {
                cropper.setAspectRatio(isNaN(ratio) ? NaN : ratio);
            }
        });
    });

    // Save
    btnSave.addEventListener('click', () => {
        if (!cropper) return;

        const width = parseInt(outWidth.value);
        const height = parseInt(outHeight.value);
        const format = outFormat.value;

        const options = {};
        if (width) options.width = width;
        if (height) options.height = height;

        const canvas = cropper.getCroppedCanvas(options);
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ext = format.split('/')[1];
            a.href = url;
            a.download = `edited-image.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
        }, format);
    });

    // Sync width/height inputs if needed (optional improvement)
    // For now, let users specify manual size if they want scaling after crop.

})();
