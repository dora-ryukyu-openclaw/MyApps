(function() {
    'use strict';

    const input = document.getElementById('text-input');
    const filename = document.getElementById('filename');
    const encoding = document.getElementById('encoding');
    const downloadBtn = document.getElementById('download-btn');
    
    const statChars = document.getElementById('stat-chars');
    const statWords = document.getElementById('stat-words');
    const statLines = document.getElementById('stat-lines');
    const statSize = document.getElementById('stat-size');

    function updateStats() {
        const text = input.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text ? text.split('\n').length : 0;
        
        // 推定サイズ (UTF-8)
        const size = new Blob([text]).size;
        
        statChars.textContent = chars.toLocaleString();
        statWords.textContent = words.toLocaleString();
        statLines.textContent = lines.toLocaleString();
        
        if (size < 1024) {
            statSize.textContent = `${size} B`;
        } else {
            statSize.textContent = `${(size / 1024).toFixed(1)} KB`;
        }
    }

    input.addEventListener('input', updateStats);

    downloadBtn.addEventListener('click', () => {
        const text = input.value;
        const enc = encoding.value;
        const fname = (filename.value || 'memo') + '.txt';

        try {
            const unicodeArray = Encoding.stringToCode(text);
            const encodedArray = Encoding.convert(unicodeArray, {
                to: enc,
                from: 'UNICODE'
            });
            const uint8Array = new Uint8Array(encodedArray);
            
            const blob = new Blob([uint8Array], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fname;
            a.click();
            URL.revokeObjectURL(url);
            
            // Visual feedback
            const originalText = downloadBtn.innerHTML;
            downloadBtn.textContent = '保存完了！';
            setTimeout(() => downloadBtn.innerHTML = originalText, 2000);
            
        } catch (err) {
            console.error(err);
            alert('ファイルの生成に失敗しました。');
        }
    });

    // Auto-focus editor
    input.focus();

})();
