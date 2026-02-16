document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const inputCount = document.getElementById('count');
    const selectType = document.getElementById('type');
    const checkStartLorem = document.getElementById('start-lorem');

    const words = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
        "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
        "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
        "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
        "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
    ];

    function getRandomWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    function generateSentence() {
        const len = Math.floor(Math.random() * 10) + 5;
        let sentence = [];
        for (let i = 0; i < len; i++) {
            sentence.push(getRandomWord());
        }
        let str = sentence.join(' ');
        return str.charAt(0).toUpperCase() + str.slice(1) + '.';
    }

    function generateParagraph() {
        const len = Math.floor(Math.random() * 4) + 3;
        let p = [];
        for (let i = 0; i < len; i++) {
            p.push(generateSentence());
        }
        return p.join(' ');
    }

    function generate() {
        const count = parseInt(inputCount.value);
        const type = selectType.value;
        const startWithLorem = checkStartLorem.checked;

        let results = [];
        if (type === 'paragraphs') {
            for (let i = 0; i < count; i++) {
                results.push(generateParagraph());
            }
            if (startWithLorem && results.length > 0) {
                const prefix = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
                results[0] = prefix + results[0].charAt(0).toLowerCase() + results[0].slice(1);
            }
            output.value = results.join('\n\n');
        } else if (type === 'sentences') {
            for (let i = 0; i < count; i++) {
                results.push(generateSentence());
            }
            if (startWithLorem && results.length > 0) {
                const prefix = "Lorem ipsum dolor sit amet, ";
                results[0] = prefix + results[0].charAt(0).toLowerCase() + results[0].slice(1);
            }
            output.value = results.join(' ');
        } else if (type === 'words') {
            for (let i = 0; i < count; i++) {
                results.push(getRandomWord());
            }
            if (startWithLorem && results.length > 0) {
                results[0] = "lorem";
                if (results.length > 1) results[1] = "ipsum";
            }
            output.value = results.join(' ');
        }
    }

    btnGenerate.addEventListener('click', generate);

    btnCopy.addEventListener('click', async () => {
        if (!output.value) return;
        try {
            await navigator.clipboard.writeText(output.value);
            const original = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => btnCopy.textContent = original, 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    });

    // Initial generate
    generate();
});
