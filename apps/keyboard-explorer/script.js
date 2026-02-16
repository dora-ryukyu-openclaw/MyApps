const vKey = document.getElementById('v-key');
const vCode = document.getElementById('v-code');
const pKey = document.getElementById('p-key');
const pCode = document.getElementById('p-code');
const pWhich = document.getElementById('p-which');
const pKeyCode = document.getElementById('p-keyCode');
const pLocation = document.getElementById('p-location');
const pModifiers = document.getElementById('p-modifiers');
const historyList = document.getElementById('history-list');

const LOCATIONS = ['Standard', 'Left', 'Right', 'Numpad'];

window.addEventListener('keydown', (e) => {
    // Prevent default for common keys to avoid scrolling etc.
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
    }

    vKey.textContent = e.key === ' ' ? 'Space' : e.key;
    vCode.textContent = e.code;

    pKey.textContent = e.key;
    pCode.textContent = e.code;
    pWhich.textContent = e.which;
    pKeyCode.textContent = e.keyCode;
    pLocation.textContent = `${e.location} (${LOCATIONS[e.location] || 'Unknown'})`;

    renderModifiers(e);
    addToHistory(e.key);
});

function renderModifiers(e) {
    const mods = [
        { label: 'Shift', active: e.shiftKey },
        { label: 'Ctrl', active: e.ctrlKey },
        { label: 'Alt', active: e.altKey },
        { label: 'Meta', active: e.metaKey }
    ];

    pModifiers.innerHTML = mods.map(m => 
        `<span class="mod-badge ${m.active ? 'active' : ''}">${m.label}</span>`
    ).join('');
}

function addToHistory(key) {
    const li = document.createElement('li');
    li.textContent = key === ' ' ? 'Space' : key;
    historyList.prepend(li);

    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}
