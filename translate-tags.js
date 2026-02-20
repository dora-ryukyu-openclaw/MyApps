const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, 'apps');

const mapping = {
    // 既存の古い日本語タグを推奨カテゴリに寄せる
    'AI・人工知能': 'AI',
    'テキスト編集': 'テキスト',
    'UI・インターフェース': 'デザイン',
    '画像・グラフィック': '画像',
    'ウェブ': '開発',
    '開発ツール': '開発',
    'システム': '開発',
    'ネットワーク': '開発',
    'マルチメディア': '画像',
    '音声・オーディオ': 'マルチメディア',
    'セキュリティ・暗号': 'セキュリティ',
    'ユーティリティ': 'ツール',
    '便利': 'ツール',
    '変換・最適化': '変換',
    '生成・ジェネレータ': '生成',

    // 英語
    'Dev': '開発',
    'Development': '開発',
    'Utility': 'ツール',
    'Image': '画像',
    'Text': 'テキスト',
    'Design': 'デザイン',
    'Security': 'セキュリティ',
    'Converter': '変換',
    'Generate': '生成',
    'Graphics': '画像',
    'Tools': 'ツール',
    'AI': 'AI'
};

const finalMapping = {
    'マルチメディア': '画像',
    'SEO': '開発',
    'プロジェクト': '開発',
    'モバイル': '開発',
    '計算': '計算',
    '暗号': 'セキュリティ',
    '時間': 'ツール'
};

const appIds = fs.readdirSync(appsDir);

appIds.forEach(id => {
    const metaPath = path.join(appsDir, id, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            if (meta.tags) {
                let newTags = meta.tags.map(t => mapping[t] || t);
                newTags = newTags.map(t => finalMapping[t] || t);
                
                // 一部の特定のタグを統合
                newTags = newTags.map(t => {
                    if (t === '画像・グラフィック') return '画像';
                    if (t === 'テキスト編集') return 'テキスト';
                    if (t === 'AI・人工知能') return 'AI';
                    return t;
                });

                newTags = [...new Set(newTags)].filter(t => t.trim() !== '');
                if (newTags.length > 3) newTags = newTags.slice(0, 3);

                meta.tags = newTags;
                fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
            }
        } catch (e) {
            console.error(`Error processing ${id}:`, e);
        }
    }
});
