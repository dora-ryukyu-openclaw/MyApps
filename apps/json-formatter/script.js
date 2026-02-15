document.addEventListener('DOMContentLoaded', () => {
    const inputJson = document.getElementById('input-json');
    const outputJson = document.getElementById('output-json');
    const btnFormat = document.getElementById('btn-format');
    const btnMinify = document.getElementById('btn-minify');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');
    const statusText = document.getElementById('status');

    function formatJSON(indent) {
        try {
            const raw = inputJson.value.trim();
            if (!raw) {
                statusText.textContent = 'Empty input';
                statusText.className = 'status-text';
                return;
            }
            const parsed = JSON.parse(raw);
            outputJson.value = JSON.stringify(parsed, null, indent);
            statusText.textContent = 'Valid JSON';
            statusText.className = 'status-text status-success';
        } catch (e) {
            outputJson.value = ''; // Clear output on error? Or keep previous? Let's clear for now.
            statusText.textContent = `Error: ${e.message}`;
            statusText.className = 'status-text status-error';
            console.error(e);
        }
    }

    btnFormat.addEventListener('click', () => formatJSON(2));
    btnMinify.addEventListener('click', () => formatJSON(0));

    btnCopy.addEventListener('click', async () => {
        if (!outputJson.value) return;
        try {
            await navigator.clipboard.writeText(outputJson.value);
            const originalText = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    });

    btnClear.addEventListener('click', () => {
        inputJson.value = '';
        outputJson.value = '';
        statusText.textContent = 'Ready';
        statusText.className = 'status-text';
        inputJson.focus();
    });

    // Auto-format on paste (optional, maybe too aggressive?)
    // inputJson.addEventListener('paste', () => setTimeout(() => formatJSON(2), 100));
});
