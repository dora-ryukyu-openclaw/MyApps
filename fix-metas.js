const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, 'apps');
const apps = fs.readdirSync(appsDir);

const tagMap = {
    'ツール': 'Utility',
    '画像': 'Image',
    '編集': 'Edit',
    'セキュリティ': 'Security',
    'パスワード': 'Password',
    '生成': 'Generator',
    '開発': 'Dev',
    '暗号': 'Crypto',
    '変換': 'Converter',
    'データ': 'Data',
    'デバッグ': 'Debug',
    'ウェブ': 'Web',
    'デザイン': 'Design',
    '要約': 'AI',
    '統計': 'Stats'
};

apps.forEach(id => {
    const metaPath = path.join(appsDir, id, 'meta.json');
    if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.tags) {
            meta.tags = meta.tags.map(t => tagMap[t] || t);
            // Deduplicate and filter
            meta.tags = [...new Set(meta.tags)];
            fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
            console.log(`Fixed meta for ${id}`);
        }
    }
});
