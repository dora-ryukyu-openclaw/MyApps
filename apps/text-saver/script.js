(function () {
    'use strict';

    const $ = (id) => document.getElementById(id);
    const $textInput = $('text-input');
    const $filename = $('filename');
    const $encoding = $('encoding');
    const $downloadBtn = $('download-btn');

    $downloadBtn.addEventListener('click', () => {
        const text = $textInput.value;
        const filename = $filename.value || 'memo';
        const encodingType = $encoding.value;

        try {
            // encoding-japanese 
            const unicodeArray = Encoding.stringToCode(text);
            const convertedArray = Encoding.convert(unicodeArray, {
                to: encodingType,
                from: 'UNICODE'
            });

            const uint8Array = new Uint8Array(convertedArray);
            
            // MIME type determination
            let mimeType = 'text/plain';
            if (encodingType === 'SJIS') {
                mimeType = 'text/plain;charset=shift_jis';
            } else if (encodingType === 'EUCJP') {
                mimeType = 'text/plain;charset=euc-jp';
            } else if (encodingType === 'UTF8') {
                mimeType = 'text/plain;charset=utf-8';
            }

            const blob = new Blob([uint8Array], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);

        } catch (error) {
            console.error('Download error:', error);
            alert('ファイルの作成に失敗しました。詳細: ' + error.message);
        }
    });

    // Mobile friendliness: Textarea focus improvements
    $textInput.addEventListener('focus', () => {
        // scroll to ensure the textarea is visible
    });

})();
