(function() {
    'use strict';

    const currentTs = document.getElementById('current-ts');
    const currentDate = document.getElementById('current-date');
    const inputTs = document.getElementById('input-ts');
    const inputUnit = document.getElementById('input-unit');
    const resLocal = document.getElementById('res-local');
    const resUtc = document.getElementById('res-utc');
    const resRel = document.getElementById('res-rel');
    const inputDate = document.getElementById('input-date');
    const resTsS = document.getElementById('res-ts-s');
    const resTsMs = document.getElementById('res-ts-ms');

    // Update Current
    setInterval(() => {
        const now = new Date();
        currentTs.textContent = Math.floor(now.getTime() / 1000);
        currentDate.textContent = formatDate(now);
    }, 1000);

    function formatDate(d) {
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0') + ' ' + 
               String(d.getHours()).padStart(2, '0') + ':' + 
               String(d.getMinutes()).padStart(2, '0') + ':' + 
               String(d.getSeconds()).padStart(2, '0');
    }

    function formatDateUTC(d) {
        return d.getUTCFullYear() + '-' + 
               String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getUTCDate()).padStart(2, '0') + ' ' + 
               String(d.getUTCHours()).padStart(2, '0') + ':' + 
               String(d.getUTCMinutes()).padStart(2, '0') + ':' + 
               String(d.getUTCSeconds()).padStart(2, '0') + ' GMT';
    }

    function formatRelative(ms) {
        const diff = Date.now() - ms;
        const seconds = Math.floor(diff / 1000);
        const absSec = Math.abs(seconds);
        
        const rtf = new Intl.RelativeTimeFormat('ja', { numeric: 'auto' });
        
        if (absSec < 60) return rtf.format(-seconds, 'second');
        if (absSec < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
        if (absSec < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
        return rtf.format(-Math.floor(seconds / 86400), 'day');
    }

    // TS to Date
    function updateTsToDate() {
        let val = parseFloat(inputTs.value);
        if (isNaN(val)) return;
        
        const ms = inputUnit.value === 's' ? val * 1000 : val;
        const d = new Date(ms);
        
        resLocal.textContent = formatDate(d);
        resUtc.textContent = formatDateUTC(d);
        resRel.textContent = formatRelative(ms);
    }

    // Date to TS
    function updateDateToTs() {
        const d = new Date(inputDate.value);
        if (isNaN(d.getTime())) return;
        
        resTsS.textContent = Math.floor(d.getTime() / 1000);
        resTsMs.textContent = d.getTime();
    }

    // Events
    inputTs.addEventListener('input', updateTsToDate);
    inputUnit.addEventListener('change', updateTsToDate);
    inputDate.addEventListener('input', updateDateToTs);

    // Initial values
    const now = new Date();
    inputTs.value = Math.floor(now.getTime() / 1000);
    // Format for datetime-local: YYYY-MM-DDTHH:mm
    inputDate.value = now.getFullYear() + '-' + 
                     String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(now.getDate()).padStart(2, '0') + 'T' + 
                     String(now.getHours()).padStart(2, '0') + ':' + 
                     String(now.getMinutes()).padStart(2, '0') + ':' + 
                     String(now.getSeconds()).padStart(2, '0');

    updateTsToDate();
    updateDateToTs();

    // Copy
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.target);
            navigator.clipboard.writeText(el.textContent);
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = original, 2000);
        });
    });

})();
