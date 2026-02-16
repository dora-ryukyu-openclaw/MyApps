import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Configuration
env.allowLocalModels = false;
env.useBrowserCache = true;

const loadingScreen = document.getElementById('loading-screen');
const consentState = document.getElementById('consent-state');
const loadingState = document.getElementById('loading-state');
const consentBtn = document.getElementById('consent-btn');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');

const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const btnSummarize = document.getElementById('btn-summarize');
const btnCopy = document.getElementById('btn-copy');

let summarizer = null;

async function initSummarizer() {
    consentState.style.display = 'none';
    loadingState.style.display = 'block';

    try {
        summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6', {
            progress_callback: (data) => {
                if (data.status === 'progress') {
                    statusText.textContent = `モデルをダウンロード中... ${Math.round(data.progress)}%`;
                    progressBar.style.width = `${data.progress}%`;
                } else if (data.status === 'ready') {
                    statusText.textContent = '準備完了！';
                    progressBar.style.width = '100%';
                }
            }
        });

        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    } catch (err) {
        console.error(err);
        statusText.textContent = 'エラーが発生しました。ページを再読み込みしてください。';
        statusText.style.color = '#ef4444';
    }
}

consentBtn.addEventListener('click', initSummarizer);

btnSummarize.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text || !summarizer) return;

    btnSummarize.disabled = true;
    btnSummarize.textContent = '要約中...';
    outputText.innerHTML = '<div class="empty-hint animate-pulse">要約しています。しばらくお待ちください...</div>';

    try {
        const result = await summarizer(text, {
            max_new_tokens: 100,
            chunk_length: 1024,
            iteration_timeout: 10000,
        });
        
        outputText.textContent = result[0].summary_text;
    } catch (err) {
        console.error(err);
        outputText.innerHTML = '<div class="empty-hint" style="color: #ef4444;">エラーが発生しました。文章が長すぎる可能性があります。</div>';
    } finally {
        btnSummarize.disabled = false;
        btnSummarize.textContent = '要約する';
    }
});

btnCopy.addEventListener('click', () => {
    const text = outputText.textContent;
    if (!text || text.includes('要約結果が表示されます')) return;
    navigator.clipboard.writeText(text);
    const original = btnCopy.textContent;
    btnCopy.textContent = 'コピーしました！';
    setTimeout(() => btnCopy.textContent = original, 2000);
});
