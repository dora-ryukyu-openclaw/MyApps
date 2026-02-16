const vBin = document.getElementById('v-bin');
const vOct = document.getElementById('v-oct');
const vDec = document.getElementById('v-dec');
const vHex = document.getElementById('v-hex');
const vAscii = document.getElementById('v-ascii');

function update(source) {
    let val;
    try {
        switch (source) {
            case 'bin': val = parseInt(vBin.value, 2); break;
            case 'oct': val = parseInt(vOct.value, 8); break;
            case 'dec': val = parseInt(vDec.value, 10); break;
            case 'hex': val = parseInt(vHex.value, 16); break;
            case 'ascii': val = vAscii.value.charCodeAt(0); break;
        }
    } catch (e) { return; }

    if (isNaN(val)) {
        if (source !== 'bin') vBin.value = '';
        if (source !== 'oct') vOct.value = '';
        if (source !== 'dec') vDec.value = '';
        if (source !== 'hex') vHex.value = '';
        if (source !== 'ascii') vAscii.value = '';
        return;
    }

    if (source !== 'bin') vBin.value = val.toString(2);
    if (source !== 'oct') vOct.value = val.toString(8);
    if (source !== 'dec') vDec.value = val.toString(10);
    if (source !== 'hex') vHex.value = val.toString(16);
    if (source !== 'ascii') vAscii.value = String.fromCharCode(val);
}

vBin.oninput = () => update('bin');
vOct.oninput = () => update('oct');
vDec.oninput = () => update('dec');
vHex.oninput = () => update('hex');
vAscii.oninput = () => update('ascii');
