const uaInput = document.getElementById('ua-input');
const detectBtn = document.getElementById('detect-me');
const resBrowser = document.getElementById('res-browser');
const resEngine = document.getElementById('res-engine');
const resOs = document.getElementById('res-os');
const resDevice = document.getElementById('res-device');
const resCpu = document.getElementById('res-cpu');

const parser = new UAParser();

function update() {
    const ua = uaInput.value;
    if (!ua) return;
    
    parser.setUA(ua);
    const result = parser.getResult();
    
    resBrowser.textContent = result.browser.name ? `${result.browser.name} ${result.browser.version}` : 'Unknown';
    resEngine.textContent = result.engine.name ? `${result.engine.name} ${result.engine.version}` : 'Unknown';
    resOs.textContent = result.os.name ? `${result.os.name} ${result.os.version}` : 'Unknown';
    resDevice.textContent = result.device.model ? `${result.device.vendor} ${result.device.model} (${result.device.type})` : 'Desktop / Generic';
    resCpu.textContent = result.cpu.architecture || 'Unknown';
}

detectBtn.onclick = () => {
    uaInput.value = navigator.userAgent;
    update();
};

uaInput.oninput = update;

// Initial detect
detectBtn.onclick();
