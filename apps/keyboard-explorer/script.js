(function() {
    'use strict';

    const vKey = document.getElementById('v-key');
    const vCode = document.getElementById('v-code');
    const pKey = document.getElementById('p-key');
    const pCode = document.getElementById('p-code');
    const pWhich = document.getElementById('p-which');
    const pKeyCode = document.getElementById('p-keyCode');
    const pLocation = document.getElementById('p-location');
    const pModifiers = document.getElementById('p-modifiers');
    const historyList = document.getElementById('history-list');

    const LOCATIONS = {
        0: 'Standard',
        1: 'Left (Shift/Alt/Ctrl/Meta)',
        2: 'Right (Shift/Alt/Ctrl/Meta)',
        3: 'Numpad'
    };

    // 音響フィードバック（オプション）
    function playClick() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
    }

    function updateDisplay(e) {
        // 表示テキストの整形
        const keyDisplay = e.key === ' ' ? 'Space' : e.key;
        
        vKey.textContent = keyDisplay;
        vCode.textContent = e.code;

        // アニメーションのリセットと実行
        vKey.classList.remove('key-flash');
        void vKey.offsetWidth; // 強制リフロー
        vKey.classList.add('key-flash');

        // 詳細情報の更新
        pKey.textContent = e.key;
        pCode.textContent = e.code;
        pWhich.textContent = e.which;
        pKeyCode.textContent = e.keyCode;
        pLocation.textContent = LOCATIONS[e.location] || `Unknown (${e.location})`;

        // モディファイアキーの状態
        const mods = [
            { label: 'Shift', active: e.shiftKey },
            { label: 'Ctrl', active: e.ctrlKey },
            { label: 'Alt', active: e.altKey },
            { label: 'Meta', active: e.metaKey }
        ];
        pModifiers.innerHTML = mods.map(m => 
            `<span class="mod-badge ${m.active ? 'active' : ''}">${m.label}</span>`
        ).join('');

        // 履歴への追加
        const li = document.createElement('li');
        li.textContent = keyDisplay;
        li.title = `Code: ${e.code} | KeyCode: ${e.keyCode}`;
        historyList.prepend(li);
        
        if (historyList.children.length > 30) {
            historyList.removeChild(historyList.lastChild);
        }

        playClick();
    }

    // グローバルなイベントリスナー
    window.addEventListener('keydown', (e) => {
        // 開発ツール (F12) や リロード (F5/Cmd+R) を妨げないように配慮
        if (e.key === 'F12' || (e.metaKey && e.key === 'r') || (e.ctrlKey && e.key === 'r')) {
            return;
        }

        // 入力を捕捉
        updateDisplay(e);

        // ページスクロールやデフォルト挙動を防止（必要最小限）
        if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // 初期表示
    vKey.textContent = 'Ready';
    vCode.textContent = 'Press any key';

})();
