const input = document.getElementById('cron-input');
const btnParse = document.getElementById('btn-parse');
const explanation = document.getElementById('cron-explanation');
const nextList = document.getElementById('next-run-list');
const presetBtns = document.querySelectorAll('.preset-btn');

function parse() {
    const val = input.value.trim();
    if (!val) return;

    try {
        // cronstrue.toString(expression, { locale: "ja" })
        const desc = cronstrue.toString(val, { 
            locale: "ja",
            use24HourTimeFormat: true 
        });
        explanation.textContent = desc;
        explanation.style.color = 'var(--fg)';
        
        updateNextRuns(val);
    } catch (e) {
        explanation.textContent = '無効な Cron 式です: ' + e;
        explanation.style.color = '#ef4444';
        nextList.innerHTML = '<li>解析できません</li>';
    }
}

/**
 * 簡易的な実行予定計算 (正確な cron-parser がない場合のフォールバック)
 * 本来は cron-parser 等を使うべきだが、
 * ここでは「形式の確認」を主目的とする。
 */
function updateNextRuns(val) {
    // プレースホルダーメッセージ
    nextList.innerHTML = '<li>実行予定のシミュレーションは現在準備中です。</li>';
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') parse();
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
