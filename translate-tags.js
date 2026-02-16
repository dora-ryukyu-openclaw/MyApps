const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, 'apps');
const mapping = {
    'Dev': '開発',
    'Design': 'デザイン',
    'Utility': 'ツール',
    'Image': '画像',
    'Text': 'テキスト',
    'Web': 'Web',
    'Security': 'セキュリティ',
    'AI': 'AI',
    'SEO': 'SEO',
    'UI': 'UI',
    'Project': 'プロジェクト'
};

const appIds = fs.readdirSync(appsDir);

appIds.forEach(id => {
    const metaPath = path.join(appsDir, id, 'meta.json');
    if (fs.existsSync(metaPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            if (meta.tags) {
                meta.tags = meta.tags.map(t => mapping[t] || t);
                fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
                console.log(`Updated tags for ${id}`);
            }
        } catch (e) {
            console.error(`Error processing ${id}:`, e);
        }
    }
});
