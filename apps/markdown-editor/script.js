const input = document.getElementById('markdown-input');
const output = document.getElementById('markdown-output');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const btnCopy = document.getElementById('btn-copy');
const btnClear = document.getElementById('btn-clear');

function update() {
    const rawValue = input.value;
    output.innerHTML = marked.parse(rawValue);
    
    // 統計更新
    charCount.textContent = `${rawValue.length} 文字`;
    wordCount.textContent = `${rawValue.trim() ? rawValue.trim().split(/\s+/).length : 0} 単語`;
    
    localStorage.setItem('myapps-markdown-draft', rawValue);
}

input.addEventListener('input', update);

btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(input.value);
    const originalText = btnCopy.textContent;
    btnCopy.textContent = 'コピー完了！';
    setTimeout(() => btnCopy.textContent = originalText, 2000);
});

btnClear.addEventListener('click', () => {
    if (confirm('エディタの内容をすべてクリアしますか？')) {
        input.value = '';
        update();
    }
});

// 初期ロード時：保存されたドラフトまたはデフォルト
const savedDraft = localStorage.getItem('myapps-markdown-draft');
if (savedDraft) {
    input.value = savedDraft;
} else {
    input.value = `# Markdown Editor
リアルタイムプレビュー機能付きの Markdown エディタです。

## 特徴
- **リアルタイム**に変換
- **GitHub スタイル**に近いシンプルな見た目
- 完全ローカル動作

\`\`\`javascript
console.log("Hello, MyApps!");
\`\`\`
`;
}

update();
