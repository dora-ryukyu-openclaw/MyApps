(function() {
    'use strict';

    const fromFormat = document.getElementById('from-format');
    const toFormat = document.getElementById('to-format');
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const labelFrom = document.getElementById('label-from');
    const labelTo = document.getElementById('label-to');
    const btnSwap = document.getElementById('btn-swap');
    const errorDisplay = document.getElementById('error-display');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');

    function update() {
        const input = inputText.value.trim();
        const from = fromFormat.value;
        const to = toFormat.value;

        labelFrom.textContent = `${from.toUpperCase()} Input`;
        labelTo.textContent = `${to.toUpperCase()} Output`;

        if (!input) {
            outputText.value = '';
            errorDisplay.style.display = 'none';
            return;
        }

        try {
            let obj;
            // Parse
            if (from === 'json') obj = JSON.parse(input);
            else if (from === 'yaml') obj = jsyaml.load(input);
            else if (from === 'xml') obj = xmljs.xml2js(input, { compact: true });

            // Stringify
            let result;
            if (to === 'json') result = JSON.stringify(obj, null, 2);
            else if (to === 'yaml') result = jsyaml.dump(obj);
            else if (to === 'xml') result = xmljs.js2xml(obj, { compact: true, spaces: 2 });

            outputText.value = result;
            errorDisplay.style.display = 'none';
        } catch (e) {
            errorDisplay.textContent = e.message;
            errorDisplay.style.display = 'block';
        }
    }

    [fromFormat, toFormat, inputText].forEach(el => el.addEventListener('input', update));

    btnSwap.addEventListener('click', () => {
        const oldFrom = fromFormat.value;
        const oldTo = toFormat.value;
        fromFormat.value = oldTo;
        toFormat.value = oldFrom;
        inputText.value = outputText.value;
        update();
    });

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.value);
        const original = btnCopy.textContent;
        btnCopy.textContent = 'Copied!';
        setTimeout(() => btnCopy.textContent = original, 2000);
    });

    btnClear.addEventListener('click', () => {
        inputText.value = '';
        update();
    });

    // Initial
    update();

})();
