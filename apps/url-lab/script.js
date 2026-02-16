const urlInput = document.getElementById('url-input');
const pProtocol = document.getElementById('p-protocol');
const pHost = document.getElementById('p-host');
const pPath = document.getElementById('p-path');
const pHash = document.getElementById('p-hash');
const paramsList = document.getElementById('params-list');
const addParamBtn = document.getElementById('add-param');

function updateDetails() {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) return reset();

    try {
        const url = new URL(rawUrl);
        pProtocol.textContent = url.protocol;
        pHost.textContent = url.host;
        pPath.textContent = url.pathname;
        pHash.textContent = url.hash || '—';

        renderParams(url.searchParams);
    } catch (e) {
        // Not a full URL, maybe just path/search
        reset();
        pPath.textContent = 'Invalid URL';
    }
}

function reset() {
    pProtocol.textContent = '—';
    pHost.textContent = '—';
    pPath.textContent = '—';
    pHash.textContent = '—';
    paramsList.innerHTML = '';
}

function renderParams(searchParams) {
    paramsList.innerHTML = '';
    searchParams.forEach((value, key) => {
        addParamRow(key, value);
    });
}

function addParamRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'param-row';
    row.innerHTML = `
        <input type="text" class="p-key" placeholder="key" value="${key}">
        <input type="text" class="p-value" placeholder="value" value="${value}">
        <button class="btn-remove" title="削除">×</button>
    `;

    row.querySelector('.btn-remove').onclick = () => {
        row.remove();
        syncFromRows();
    };

    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.oninput = syncFromRows;
    });

    paramsList.appendChild(row);
}

function syncFromRows() {
    const rows = paramsList.querySelectorAll('.param-row');
    const params = new URLSearchParams();
    rows.forEach(row => {
        const k = row.querySelector('.p-key').value;
        const v = row.querySelector('.p-value').value;
        if (k) params.append(k, v);
    });

    try {
        const url = new URL(urlInput.value);
        url.search = params.toString();
        urlInput.value = url.toString();
        updateDetails();
    } catch (e) {
        // Fallback for partial URLs
        const search = params.toString();
        urlInput.value = urlInput.value.split('?')[0] + (search ? '?' + search : '');
    }
}

urlInput.addEventListener('input', updateDetails);

addParamBtn.onclick = () => addParamRow();

document.getElementById('btn-decode').onclick = () => {
    urlInput.value = decodeURIComponent(urlInput.value);
    updateDetails();
};

document.getElementById('btn-encode').onclick = () => {
    urlInput.value = encodeURI(urlInput.value);
    updateDetails();
};

document.getElementById('btn-clear').onclick = () => {
    urlInput.value = '';
    reset();
};

updateDetails();
