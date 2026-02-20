(function() {
    'use strict';

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.toggle('active', b === btn));
            tabContents.forEach(c => c.classList.toggle('active', c.id === `tab-${target}`));
            if (target !== 'scan') {
                stopScanner();
            }
        });
    });

    /* --- Create --- */
    const qrInput = document.getElementById('qr-input');
    const qrResult = document.getElementById('qr-result');
    const btnDownload = document.getElementById('btn-download');

    let qrcode = null;

    function generateQR() {
        if (!qrcode) {
            qrcode = new QRCode(qrResult, {
                text: qrInput.value || " ",
                width: 256,
                height: 256,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } else {
            qrcode.clear();
            qrcode.makeCode(qrInput.value || " ");
        }
    }

    qrInput.addEventListener('input', generateQR);

    btnDownload.addEventListener('click', () => {
        const img = qrResult.querySelector('img');
        if (!img) return;
        const a = document.createElement('a');
        a.href = img.src;
        a.download = 'qrcode.png';
        a.click();
    });

    // Initial QR
    generateQR();

    /* --- Scan --- */
    const video = document.getElementById('scan-video');
    const canvas = document.getElementById('scan-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const scanPlaceholder = document.getElementById('scan-placeholder');
    const scanOverlay = document.getElementById('scan-overlay');
    const btnStartCamera = document.getElementById('btn-start-camera');
    const btnOpenFile = document.getElementById('btn-open-file');
    const inputFile = document.getElementById('input-file');
    const scanResult = document.getElementById('scan-result');
    const btnCopy = document.getElementById('btn-copy');

    let scanning = false;
    let stream = null;

    btnStartCamera.addEventListener('click', async () => {
        if (scanning) {
            stopScanner();
            return;
        }

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            scanning = true;
            scanPlaceholder.style.display = 'none';
            scanOverlay.style.display = 'flex';
            btnStartCamera.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>
                カメラ停止
            `;
            requestAnimationFrame(tick);
        } catch (err) {
            console.error(err);
            alert("カメラの起動に失敗しました。権限を確認してください。");
        }
    });

    function stopScanner() {
        scanning = false;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        btnStartCamera.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            カメラ起動
        `;
        scanPlaceholder.style.display = 'flex';
        scanOverlay.style.display = 'none';
    }

    function tick() {
        if (!scanning) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                scanResult.value = code.data;
                // Vibrate if supported
                if ("vibrate" in navigator) navigator.vibrate(200);
                stopScanner();
                return;
            }
        }
        requestAnimationFrame(tick);
    }

    btnOpenFile.addEventListener('click', () => inputFile.click());
    inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    scanResult.value = code.data;
                } else {
                    alert("QRコードが見つかりませんでした。");
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(scanResult.value);
        const original = btnCopy.innerHTML;
        btnCopy.textContent = 'コピー完了！';
        setTimeout(() => btnCopy.innerHTML = original, 2000);
    });

})();
