const sbWidth = document.getElementById('sb-width');
const sbThumb = document.getElementById('sb-thumb-color');
const sbTrack = document.getElementById('sb-track-color');
const sbRadius = document.getElementById('sb-radius');
const target = document.getElementById('scroll-target');
const cssCode = document.getElementById('css-code');
const copyBtn = document.getElementById('copy-code');

function update() {
    const w = sbWidth.value + 'px';
    const thumb = sbThumb.value;
    const track = sbTrack.value;
    const r = sbRadius.value + 'px';

    target.style.setProperty('--sb-w', w);
    target.style.setProperty('--sb-track', track);
    target.style.setProperty('--sb-thumb', thumb);
    target.style.setProperty('--sb-r', r);

    const code = `/* WebKit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: ${w};
}
::-webkit-scrollbar-track {
  background: ${track};
}
::-webkit-scrollbar-thumb {
  background: ${thumb};
  border-radius: ${r};
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: ${thumb} ${track};
}`;
    cssCode.textContent = code;
}

[sbWidth, sbThumb, sbTrack, sbRadius].forEach(el => {
    el.addEventListener('input', update);
});

copyBtn.onclick = () => {
    navigator.clipboard.writeText(cssCode.textContent);
    const orig = copyBtn.textContent;
    copyBtn.textContent = 'Done!';
    setTimeout(() => copyBtn.textContent = orig, 2000);
};

update();
