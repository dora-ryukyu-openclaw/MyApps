const inputs = {
    title: document.getElementById('i-title'),
    desc: document.getElementById('i-desc'),
    image: document.getElementById('i-image'),
    url: document.getElementById('i-url')
};

const preview = {
    url: document.getElementById('p-url'),
    title: document.getElementById('p-title'),
    desc: document.getElementById('p-desc'),
    imageBg: document.getElementById('p-image-bg'),
    domain: document.getElementById('p-domain'),
    ogTitle: document.getElementById('p-og-title'),
    ogDesc: document.getElementById('p-og-desc')
};

const code = document.getElementById('meta-code');
const copyBtn = document.getElementById('copy-meta');

function update() {
    const t = inputs.title.value || 'サイト名 | ページタイトル';
    const d = inputs.desc.value || 'ページの説明文がここに表示されます。120〜160文字程度が最適です。';
    const img = inputs.image.value || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80';
    const u = inputs.url.value || 'https://example.com/';

    // Update Text Previews
    preview.title.textContent = t;
    preview.desc.textContent = d;
    preview.url.textContent = u;
    
    preview.ogTitle.textContent = t;
    preview.ogDesc.textContent = d;
    
    try {
        const domain = new URL(u).hostname;
        preview.domain.textContent = domain;
    } catch(e) {
        preview.domain.textContent = 'example.com';
    }

    // Update Image Preview
    preview.imageBg.style.backgroundImage = `url("${img}")`;

    // Generate Code
    const metaHtml = `<!-- Primary Meta Tags -->
<title>${t}</title>
<meta name="title" content="${t}">
<meta name="description" content="${d}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${u}">
<meta property="twitter:title" content="${t}">
<meta property="twitter:description" content="${d}">
<meta property="twitter:image" content="${img}">`;

    code.textContent = metaHtml;
}

Object.values(inputs).forEach(input => {
    input.addEventListener('input', update);
});

copyBtn.onclick = () => {
    navigator.clipboard.writeText(code.textContent);
    const orig = copyBtn.textContent;
    copyBtn.textContent = '完了！';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

update();
