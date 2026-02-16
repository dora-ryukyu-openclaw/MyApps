const target = document.getElementById('target-triangle');
const cssCode = document.getElementById('css-code');
const dirBtns = document.querySelectorAll('.dir-btn');
const wIn = document.getElementById('w');
const hIn = document.getElementById('h');
const colorIn = document.getElementById('color');
const copyBtn = document.getElementById('copy-btn');

let currentDir = 'up';

function update() {
    const w = parseInt(wIn.value);
    const h = parseInt(hIn.value);
    const color = colorIn.value;

    let styles = {
        width: '0',
        height: '0',
        borderStyle: 'solid',
        borderColor: 'transparent'
    };

    switch (currentDir) {
        case 'up':
            styles.borderWidth = `0 ${w/2}px ${h}px ${w/2}px`;
            styles.borderBottomColor = color;
            break;
        case 'down':
            styles.borderWidth = `${h}px ${w/2}px 0 ${w/2}px`;
            styles.borderTopColor = color;
            break;
        case 'right':
            styles.borderWidth = `${h/2}px 0 ${h/2}px ${w}px`;
            styles.borderLeftColor = color;
            break;
        case 'left':
            styles.borderWidth = `${h/2}px ${w}px ${h/2}px 0`;
            styles.borderRightColor = color;
            break;
        case 'top-left':
            styles.borderWidth = `${h}px ${w}px 0 0`;
            styles.borderTopColor = color;
            break;
        case 'top-right':
            styles.borderWidth = `0 ${w}px ${h}px 0`;
            styles.borderTopColor = color;
            break;
        case 'bottom-left':
            styles.borderWidth = `${h}px 0 0 ${w}px`;
            styles.borderBottomColor = color;
            break;
        case 'bottom-right':
            styles.borderWidth = `0 0 ${h}px ${w}px`;
            styles.borderBottomColor = color;
            break;
    }

    Object.assign(target.style, styles);

    const code = `.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${styles.borderWidth};
  border-color: ${styles.borderColor};
  ${styles.borderTopColor ? `border-top-color: ${styles.borderTopColor};` : ''}
  ${styles.borderBottomColor ? `border-bottom-color: ${styles.borderBottomColor};` : ''}
  ${styles.borderLeftColor ? `border-left-color: ${styles.borderLeftColor};` : ''}
  ${styles.borderRightColor ? `border-right-color: ${styles.borderRightColor};` : ''}
}`;
    cssCode.textContent = code.replace(/\n\s*\n/g, '\n');
}

dirBtns.forEach(btn => {
    btn.onclick = () => {
        dirBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDir = btn.dataset.dir;
        update();
    };
});

[wIn, hIn, colorIn].forEach(el => el.oninput = update);

copyBtn.onclick = () => {
    navigator.clipboard.writeText(cssCode.textContent);
};

// Initial
dirBtns[0].click();
