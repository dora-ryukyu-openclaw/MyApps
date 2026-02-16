const grid = document.getElementById('clock-grid');
const tzSelect = document.getElementById('tz-select');
const addBtn = document.getElementById('add-btn');

let activeClocks = JSON.parse(localStorage.getItem('myapps-worldclocks')) || [
    { city: '東京', tz: 'Asia/Tokyo' },
    { city: 'ニューヨーク', tz: 'America/New_York' },
    { city: 'ロンドン', tz: 'Europe/London' }
];

const timezones = [
    { name: '東京 (JST)', value: 'Asia/Tokyo' },
    { name: 'ソウル (KST)', value: 'Asia/Seoul' },
    { name: '北京 (CST)', value: 'Asia/Shanghai' },
    { name: 'シンガポール', value: 'Asia/Singapore' },
    { name: 'ドバイ', value: 'Asia/Dubai' },
    { name: 'ロンドン (GMT/BST)', value: 'Europe/London' },
    { name: 'パリ (CET)', value: 'Europe/Paris' },
    { name: 'ニューヨーク (EST/EDT)', value: 'America/New_York' },
    { name: 'ロサンゼルス (PST/PDT)', value: 'America/Los_Angeles' },
    { name: 'シドニー', value: 'Australia/Sydney' }
];

function init() {
    timezones.forEach(tz => {
        const opt = document.createElement('option');
        opt.value = tz.value;
        opt.textContent = tz.name;
        tzSelect.appendChild(opt);
    });

    setInterval(update, 1000);
    update();
}

function update() {
    grid.innerHTML = '';
    activeClocks.forEach((clock, idx) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ja-JP', { timeZone: clock.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('ja-JP', { timeZone: clock.tz, month: 'short', day: 'numeric', weekday: 'short' });

        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
            <button class="remove-btn" onclick="removeClock(${idx})">×</button>
            <div class="clock-city">${clock.city}</div>
            <div class="clock-time">${timeStr}</div>
            <div class="clock-date">${dateStr}</div>
        `;
        grid.appendChild(card);
    });
}

window.removeClock = (idx) => {
    activeClocks.splice(idx, 1);
    save();
    update();
};

addBtn.onclick = () => {
    const tz = tzSelect.value;
    const name = tzSelect.options[tzSelect.selectedIndex].text.split(' ')[0];
    if (!activeClocks.find(c => c.tz === tz)) {
        activeClocks.push({ city: name, tz });
        save();
        update();
    }
};

function save() {
    localStorage.setItem('myapps-worldclocks', JSON.stringify(activeClocks));
}

init();
