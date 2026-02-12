/**
 * PDF改行除去ランドリー — メインスクリプト
 *
 * コア機能:
 *   1. 改行削除（空行=段落区切りは保持）
 *   2. ハイフネーション結合（ex-\nample → example）
 *   3. 英文・和文 自動判定（スペース処理の切替）
 *
 * UX:
 *   - Autoモード: Ctrl+V でフォーカス不問の自動貼付→処理→クリップボード再コピー
 *   - 手動モード: textarea に入力 → リアルタイム整形
 */
(function () {
  'use strict';

  /* ============================================
     DOM 参照
     ============================================ */
  const $input      = document.getElementById('input-area');
  const $output     = document.getElementById('output-area');
  const $inputCount = document.getElementById('input-count');
  const $langBadge  = document.getElementById('lang-badge');
  const $toggleBtn  = document.getElementById('toggle-btn');
  const $btnCopy    = document.getElementById('btn-copy');
  const $btnClear   = document.getElementById('btn-clear');
  const $toast      = document.getElementById('toast');
  const $panelOut   = document.querySelector('.panel-output');

  /* ============================================
     状態
     ============================================ */
  let autoMode = false;

  /* ============================================
     言語判定
     ============================================ */
  /**
   * テキストが主に日本語かどうかを判定する。
   * CJK統合漢字・ひらがな・カタカナの割合で判断。
   * @param {string} text
   * @returns {'ja'|'en'}
   */
  function detectLang(text) {
    if (!text) return 'en';
    // CJK + ひらがな + カタカナ の文字をカウント
    const jaChars = text.match(/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]/g);
    const jaCount = jaChars ? jaChars.length : 0;
    // アルファベット文字をカウント
    const enChars = text.match(/[a-zA-Z]/g);
    const enCount = enChars ? enChars.length : 0;
    const total = jaCount + enCount;
    if (total === 0) return 'en';
    // 日本語文字が 30% 以上なら日本語と判定
    return jaCount / total >= 0.3 ? 'ja' : 'en';
  }

  /* ============================================
     テキスト整形ロジック
     ============================================ */
  /**
   * PDFコピペテキストのクリーニング処理。
   *
   * 処理順序:
   *   1. \r\n → \n 正規化
   *   2. ハイフネーション結合（行末 - + 改行 → 結合）
   *   3. 段落分割（空行 = \n\n+ で分割）
   *   4. 段落内の改行をスペース（英）or 削除（日）に
   *   5. 段落間を \n\n で再結合
   *
   * @param {string} raw
   * @returns {{ cleaned: string, lang: string }}
   */
  function cleanText(raw) {
    if (!raw || !raw.trim()) return { cleaned: '', lang: 'en' };

    const lang = detectLang(raw);

    let text = raw;

    // 1. 改行コード正規化
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 2. ハイフネーション結合
    //    行末の "-" 直後に改行 → ハイフンと改行を除去して単語を結合
    //    例: "ex-\nample" → "example"
    text = text.replace(/([a-zA-Z])-\n([a-zA-Z])/g, '$1$2');

    // 3. 段落分割（空行で分割）
    //    2つ以上連続する改行を段落区切りとみなす
    const paragraphs = text.split(/\n{2,}/);

    // 4. 各段落内の単一改行をスペース or 削除
    const joiner = lang === 'ja' ? '' : ' ';
    const cleaned = paragraphs
      .map(p => {
        // 段落内の改行を置換
        let line = p.replace(/\n/g, joiner);
        // 連続スペースを1つにまとめる（英語時）
        if (lang === 'en') {
          line = line.replace(/ {2,}/g, ' ');
        }
        return line.trim();
      })
      .filter(p => p.length > 0)
      .join('\n\n');

    return { cleaned, lang };
  }

  /* ============================================
     UI 更新
     ============================================ */
  function updateOutput(text) {
    const { cleaned, lang } = cleanText(text);
    $output.textContent = cleaned;

    // 入力文字数
    $inputCount.textContent = `${text.length} chars`;

    // 言語バッジ
    if (text.trim()) {
      $langBadge.textContent = lang === 'ja' ? '日本語' : 'English';
      $langBadge.classList.add('detected');
    } else {
      $langBadge.textContent = '—';
      $langBadge.classList.remove('detected');
    }

    // パネル処理アニメーション
    if (cleaned) {
      $panelOut.classList.add('processing');
      setTimeout(() => $panelOut.classList.remove('processing'), 600);
    }

    return cleaned;
  }

  /* ============================================
     トースト
     ============================================ */
  let toastTimer = null;
  function showToast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 2000);
  }

  /* ============================================
     クリップボード操作
     ============================================ */
  async function copyToClipboard(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      // ボタンフィードバック
      $btnCopy.classList.add('copied');
      const $label = $btnCopy.querySelector('.copy-label');
      $label.textContent = 'コピー済';
      setTimeout(() => {
        $btnCopy.classList.remove('copied');
        $label.textContent = 'コピー';
      }, 1500);
    } catch (err) {
      showToast('⚠ クリップボードへのアクセスが拒否されました');
    }
  }

  /* ============================================
     イベント: 手動入力
     ============================================ */
  $input.addEventListener('input', () => {
    updateOutput($input.value);
  });

  /* ============================================
     イベント: ペースト
     ============================================ */
  $input.addEventListener('paste', (e) => {
    // デフォルトのペーストは許可してから処理
    setTimeout(() => {
      const cleaned = updateOutput($input.value);
      if (autoMode && cleaned) {
        copyToClipboard(cleaned);
        showToast('✨ 整形＆クリップボードにコピー完了');
      }
    }, 0);
  });

  /* ============================================
     イベント: Autoモード — グローバル Ctrl+V
     ============================================ */
  document.addEventListener('keydown', async (e) => {
    if (!autoMode) return;
    // Ctrl+V (or Cmd+V)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      // input にフォーカスがあるならデフォルト動作に任せる
      if (document.activeElement === $input) return;

      e.preventDefault();
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          $input.value = text;
          const cleaned = updateOutput(text);
          if (cleaned) {
            await copyToClipboard(cleaned);
            showToast('✨ 整形＆クリップボードにコピー完了');
          }
        }
      } catch (err) {
        showToast('⚠ クリップボードの読み取り許可が必要です');
      }
    }
  });

  /* ============================================
     イベント: Autoモードトグル
     ============================================ */
  $toggleBtn.addEventListener('click', () => {
    autoMode = !autoMode;
    $toggleBtn.setAttribute('aria-pressed', autoMode);
    showToast(autoMode ? '⚡ Autoモード ON — Ctrl+V で自動処理' : 'Autoモード OFF');
  });

  /* ============================================
     イベント: コピーボタン
     ============================================ */
  $btnCopy.addEventListener('click', () => {
    const text = $output.textContent;
    if (text) {
      copyToClipboard(text);
      showToast('📋 クリップボードにコピーしました');
    }
  });

  /* ============================================
     イベント: クリアボタン
     ============================================ */
  $btnClear.addEventListener('click', () => {
    $input.value = '';
    $output.textContent = '';
    $inputCount.textContent = '0 chars';
    $langBadge.textContent = '—';
    $langBadge.classList.remove('detected');
    $input.focus();
  });
})();
