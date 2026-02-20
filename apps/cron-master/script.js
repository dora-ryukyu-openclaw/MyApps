const input = document.getElementById('cron-input');
const btnParse = document.getElementById('btn-parse');
const explanation = document.getElementById('cron-explanation');
const nextList = document.getElementById('next-run-list');
const presetBtns = document.querySelectorAll('.preset-btn');

function parse() {
    const val = input.value.trim();
    if (!val) {
        input.classList.add('error');
        return;
    }

    input.classList.remove('error');

    try {
        // cronstrue.toString(expression, { locale: "ja" })
        const desc = cronstrue.toString(val, { 
            locale: "ja",
            use24HourTimeFormat: true 
        });
        explanation.textContent = desc;
        explanation.style.color = 'var(--c-text)';
        
        updateNextRuns(val);
    } catch (e) {
        explanation.textContent = '無効な Cron 式です';
        explanation.style.color = 'var(--c-error)';
        input.classList.add('error');
        nextList.innerHTML = '<li>解析できませんでした</li>';
    }
}

/**
 * 簡易的な実行予定計算
 */
function updateNextRuns(val) {
    // 解析用のシンプルなメッセージ
    nextList.innerHTML = '<li>実行予定のシミュレーション機能は近日公開予定です。</li>';
    
    // 実際に次の時間を計算したい場合は cdnjs 等から cron-parser を呼ぶ必要があるが、
    // 現状は UI 改善にフォーカス
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') parse();
});

input.addEventListener('input', () => {
    input.classList.remove('error');
});

btnParse.addEventListener('click', parse);

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        input.value = btn.dataset.val;
        parse();
    });
});

// Initial parse
parse();
