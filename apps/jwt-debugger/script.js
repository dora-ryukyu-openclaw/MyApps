(function() {
    'use strict';

    const inputJwt = document.getElementById('input-jwt');
    const outputHeader = document.getElementById('output-header');
    const outputPayload = document.getElementById('output-payload');
    const outputSignature = document.getElementById('output-signature');
    const statusBadge = document.getElementById('status-badge');

    function base64UrlDecode(str) {
        // Add padding
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        try {
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return null;
        }
    }

    function update() {
        const token = inputJwt.value.trim();
        if (!token) {
            statusBadge.textContent = 'Enter JWT';
            statusBadge.classList.remove('valid');
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            statusBadge.textContent = 'Invalid Format';
            statusBadge.classList.remove('valid');
            return;
        }

        const headerJson = base64UrlDecode(parts[0]);
        const payloadJson = base64UrlDecode(parts[1]);

        if (headerJson && payloadJson) {
            try {
                outputHeader.textContent = JSON.stringify(JSON.parse(headerJson), null, 2);
                outputPayload.textContent = JSON.stringify(JSON.parse(payloadJson), null, 2);
                outputSignature.textContent = parts[2];
                statusBadge.textContent = 'Decoded';
                statusBadge.classList.add('valid');
            } catch (e) {
                statusBadge.textContent = 'Parse Error';
                statusBadge.classList.remove('valid');
            }
        } else {
            statusBadge.textContent = 'Decode Error';
            statusBadge.classList.remove('valid');
        }
    }

    inputJwt.addEventListener('input', update);

    // Initial
    update();

})();
