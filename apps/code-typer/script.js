const source = document.getElementById('source-code');
const output = document.getElementById('output-code');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const speedInput = document.getElementById('type-speed');

let timer = null;
let index = 0;

function type() {
    const text = source.value;
    if (index < text.length) {
        output.textContent += text[index];
        index++;
        
        // Trigger Prism highlighting periodically or at specific points
        // For efficiency in typing, we highlight the whole block
        Prism.highlightElement(output);
        
        // Scroll to bottom
        const body = document.querySelector('.window-body');
        body.scrollTop = body.scrollHeight;

        timer = setTimeout(type, speedInput.value);
    } else {
        btnStart.textContent = '再生開始';
        btnStart.disabled = false;
    }
}

btnStart.addEventListener('click', () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
        btnStart.textContent = '再生開始';
    } else {
        if (index === 0) output.textContent = '';
        btnStart.textContent = '一時停止';
        type();
    }
});

btnReset.addEventListener('click', () => {
    clearTimeout(timer);
    timer = null;
    index = 0;
    output.textContent = '';
    btnStart.textContent = '再生開始';
    btnStart.disabled = false;
});

// Default sample code
source.value = `function hello() {
  console.log("Hello, MyApps!");
  const tools = ["Glass", "AI", "Icons"];
  return tools.map(t => t.toUpperCase());
}

hello();`;
