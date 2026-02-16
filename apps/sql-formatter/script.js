(function() {
    'use strict';

    const inputSql = document.getElementById('input-sql');
    const outputSql = document.getElementById('output-sql');
    const dialectSelect = document.getElementById('dialect');
    const indentSelect = document.getElementById('indent');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');

    function update() {
        const sql = inputSql.value.trim();
        if (!sql) {
            outputSql.value = '';
            return;
        }

        try {
            const dialect = dialectSelect.value;
            const indentVal = indentSelect.value;
            const indent = indentVal === 'tab' ? '\t' : ' '.repeat(parseInt(indentVal));

            const result = sqlFormatter.format(sql, {
                language: dialect,
                tabWidth: indentVal === 'tab' ? 2 : parseInt(indentVal),
                useTabs: indentVal === 'tab',
                keywordCase: 'upper'
            });

            outputSql.value = result;
        } catch (e) {
            outputSql.value = `Error: ${e.message}`;
        }
    }

    [inputSql, dialectSelect, indentSelect].forEach(el => el.addEventListener('input', update));

    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(outputSql.value);
        const original = btnCopy.textContent;
        btnCopy.textContent = 'Copied!';
        setTimeout(() => btnCopy.textContent = original, 2000);
    });

    btnClear.addEventListener('click', () => {
        inputSql.value = '';
        update();
    });

    // Initial
    update();

})();
