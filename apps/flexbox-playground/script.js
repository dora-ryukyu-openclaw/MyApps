const container = document.getElementById('flex-container');
const cssCode = document.getElementById('css-code');
const addItemBtn = document.getElementById('add-item');
const removeItemBtn = document.getElementById('remove-item');

const controls = {
    direction: document.getElementById('flex-direction'),
    justify: document.getElementById('justify-content'),
    align: document.getElementById('align-items'),
    wrap: document.getElementById('flex-wrap'),
    gap: document.getElementById('gap')
};

let itemCount = 3;

function renderItems() {
    container.innerHTML = '';
    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement('div');
        item.className = 'flex-item';
        item.textContent = i;
        // Randomize size slightly for better visualization
        if (controls.direction.value.includes('column')) {
            item.style.width = '100px';
        } else {
            item.style.height = '100px';
        }
        container.appendChild(item);
    }
}

function update() {
    const d = controls.direction.value;
    const j = controls.justify.value;
    const a = controls.align.value;
    const w = controls.wrap.value;
    const g = controls.gap.value;

    container.style.flexDirection = d;
    container.style.justifyContent = j;
    container.style.alignItems = a;
    container.style.flexWrap = w;
    container.style.gap = `${g}px`;

    const code = `.container {
  display: flex;
  flex-direction: ${d};
  justify-content: ${j};
  align-items: ${a};
  flex-wrap: ${w};
  gap: ${g}px;
}`;
    cssCode.textContent = code;

    // Adjust item heights/widths for column mode
    const items = container.querySelectorAll('.flex-item');
    items.forEach(item => {
        if (d.includes('column')) {
            item.style.width = 'auto';
            item.style.minWidth = '100px';
            item.style.height = '60px';
        } else {
            item.style.width = '60px';
            item.style.height = 'auto';
            item.style.minHeight = '100px';
        }
    });
}

Object.values(controls).forEach(c => {
    c.addEventListener('change', update);
    c.addEventListener('input', update);
});

addItemBtn.onclick = () => {
    itemCount++;
    renderItems();
    update();
};

removeItemBtn.onclick = () => {
    if (itemCount > 1) {
        itemCount--;
        renderItems();
        update();
    }
};

renderItems();
update();
