const input = document.getElementById('markdown-input');
const output = document.getElementById('markdown-output');

function update() {
    const rawValue = input.value;
    output.innerHTML = marked.parse(rawValue);
}

input.addEventListener('input', update);

// Example content
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

update();
