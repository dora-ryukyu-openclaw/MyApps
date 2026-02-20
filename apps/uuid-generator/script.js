(function() {
    'use strict';

    const countInput = document.getElementById('count');
    const genBtn = document.getElementById('gen-btn');
    const copyBtn = document.getElementById('copy-btn');
    const uuidList = document.getElementById('uuid-list');
    const outputRaw = document.getElementById('output-raw');

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function renderUUIDs() {
        const count = parseInt(countInput.value) || 1;
        const uuids = Array.from({ length: count }, generateUUID);
        
        uuidList.innerHTML = '';
        outputRaw.value = uuids.join('\n');
        
        uuids.forEach(uuid => {
            const item = document.createElement('div');
            item.className = 'uuid-item';
            item.innerHTML = `
                <span class="uuid-val">${uuid}</span>
                <button class="btn-icon-only copy-single" data-uuid="${uuid}" title="Copy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                </button>
            `;
            uuidList.appendChild(item);
        });

        // Add event listeners to single copy buttons
        document.querySelectorAll('.copy-single').forEach(btn => {
            btn.addEventListener('click', () => {
                const uuid = btn.dataset.uuid;
                navigator.clipboard.writeText(uuid);
                const original = btn.innerHTML;
                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                setTimeout(() => btn.innerHTML = original, 2000);
            });
        });
    }

    genBtn.addEventListener('click', renderUUIDs);

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputRaw.value);
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => copyBtn.innerHTML = original, 2000);
    });

    // Initial generate
    renderUUIDs();

})();
