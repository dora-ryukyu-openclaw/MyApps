const container = document.getElementById('grid-container');
const cssCode = document.getElementById('css-code');

const controls = {
    cols: document.getElementById('cols'),
    rows: document.getElementById('rows'),
    colGap: document.getElementById('col-gap'),
    rowGap: document.getElementById('row-gap')
};

function update() {
    const c = parseInt(controls.cols.value) || 1;
    const r = parseInt(controls.rows.value) || 1;
    const cg = controls.colGap.value;
    const rg = controls.rowGap.value;

    container.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${r}, 1fr)`;
    container.style.columnGap = `${cg}px`;
    container.style.rowGap = `${rg}px`;

    // Render Items
    container.innerHTML = '';
    const total = c * r;
    for (let i = 1; i <= total; i++) {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.textContent = i;
        container.appendChild(div);
    }

    const code = `.container {
  display: grid;
  grid-template-columns: repeat(${c}, 1fr);
  grid-template-rows: repeat(${r}, 1fr);
  column-gap: ${cg}px;
  row-gap: ${rg}px;
}`;
    cssCode.textContent = code;
}

Object.values(controls).forEach(input => {
    input.addEventListener('input', update);
});

update();
