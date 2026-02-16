// Since we can't easily import the ICONS from header.js directly without modules,
// and header.js is a script, we'll fetch the content and parse it or just copy the keys we know.
// Actually, I'll fetch header.js and regex out the ICONS object for a "meta" experience.

async function init() {
    const res = await fetch('../../shared/header.js');
    const code = await res.text();
    
    // Simple regex to extract the ICONS object content
    const match = code.match(/const ICONS = \{([\s\S]*?)\};/);
    if (!match) return;

    // Convert string-like object entries to a real object
    // Note: This is a hacky way to do it without eval, but safe for this project.
    const icons = {};
    const lines = match[1].split('\n');
    lines.forEach(line => {
        const m = line.match(/'(.*?)':\s*'(.*?)'/);
        if (m) {
            icons[m[1]] = m[2];
        }
    });

    const searchInput = document.getElementById('search-input');
    const iconGrid = document.getElementById('icon-grid');
    const count = document.getElementById('result-count');

    function render(filter = '') {
        const keys = Object.keys(icons).filter(k => k.includes(filter.toLowerCase()));
        iconGrid.innerHTML = '';
        keys.forEach(k => {
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = `
                <div class="icon-svg-wrap">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</svg>
                </div>
                <div class="icon-name">${k}</div>
            `;
            card.onclick = () => {
                navigator.clipboard.writeText(icons[k]);
                alert(`SVG path for "${k}" copied!`);
            };
            iconGrid.appendChild(card);
        });
        count.textContent = `${keys.length} icons found`;
    }

    searchInput.oninput = (e) => render(e.target.value);
    render();
}

init();
