/**
 * Excel表 → Markdown/LaTeX変換器 — メインスクリプト
 *
 * コア機能:
 *   1. TSVパース（Excelコピーのタブ区切りデータ解析）
 *   2. Markdown / LaTeX / HTML フォーマット出力
 *   3. アラインメント自動推測（数値→右寄せ、文字→左寄せ）
 *   4. ライブエディット（プレビューのセルをクリック→直接編集→コード追従）
 *   5. ワンクリックコピー
 */
(function () {
  'use strict';

  /* ============================================
     DOM
     ============================================ */
  const $tsvInput    = document.getElementById('tsv-input');
  const $previewBody = document.getElementById('preview-body');
  const $codeOutput  = document.getElementById('code-output');
  const $codeTitle   = document.getElementById('code-title');
  const $tableInfo   = document.getElementById('table-info');
  const $btnCopy     = document.getElementById('btn-copy');
  const $btnPaste    = document.getElementById('btn-paste');
  const $btnClear    = document.getElementById('btn-clear');
  const $optHeader   = document.getElementById('opt-header');
  const $toast       = document.getElementById('toast');
  const fmtBtns      = document.querySelectorAll('.fmt-btn');

  /* ============================================
     状態
     ============================================ */
  let tableData  = []; // 2D配列
  let alignments = []; // 'left' | 'right' | 'center' per column
  let format     = 'markdown';

  /* ============================================
     TSV パース
     ============================================ */
  function parseTSV(text) {
    if (!text.trim()) return [];
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    // 末尾の空行を除去
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines.map(line => line.split('\t'));
  }

  /* ============================================
     アラインメント推測
     ============================================ */
  function guessAlignments(data) {
    if (!data.length) return [];
    const cols = Math.max(...data.map(r => r.length));
    const aligns = [];
    const startRow = $optHeader.checked ? 1 : 0;

    for (let c = 0; c < cols; c++) {
      let numCount = 0;
      let total = 0;
      for (let r = startRow; r < data.length; r++) {
        const val = (data[r][c] || '').trim();
        if (!val) continue;
        total++;
        // 数値判定（カンマ区切り・小数・パーセント・通貨記号含む）
        if (/^[¥$€£]?\s*-?[\d,]+\.?\d*%?$/.test(val)) {
          numCount++;
        }
      }
      aligns.push(total > 0 && numCount / total >= 0.6 ? 'right' : 'left');
    }
    return aligns;
  }

  /* ============================================
     プレビュー描画
     ============================================ */
  function renderPreview() {
    if (!tableData.length) {
      $previewBody.innerHTML = '<div class="preview-empty">表データを入力するとプレビューが表示されます</div>';
      $tableInfo.textContent = '';
      return;
    }

    const cols = Math.max(...tableData.map(r => r.length));
    const hasHeader = $optHeader.checked;
    $tableInfo.textContent = `${tableData.length}行 × ${cols}列`;

    let html = '<table class="preview-table">';

    tableData.forEach((row, r) => {
      const isHeader = hasHeader && r === 0;
      const tag = isHeader ? 'th' : 'td';
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        const val = row[c] || '';
        const alignClass = alignments[c] === 'right' ? ' class="align-right"'
          : alignments[c] === 'center' ? ' class="align-center"' : '';

        if (isHeader) {
          // ヘッダーにはアラインメント切替ボタン付き
          const indicator = `<span class="align-indicator" data-col="${c}" title="クリックでアラインメント変更">` +
            (alignments[c] === 'left' ? '◀' : alignments[c] === 'right' ? '▶' : '◆') + '</span>';
          html += `<${tag}${alignClass}>${esc(val)}${indicator}</${tag}>`;
        } else {
          html += `<${tag}${alignClass} contenteditable="true" data-r="${r}" data-c="${c}">${esc(val)}</${tag}>`;
        }
      }
      html += '</tr>';
    });

    html += '</table>';
    $previewBody.innerHTML = html;

    // ライブエディットイベント
    $previewBody.querySelectorAll('td[contenteditable]').forEach(td => {
      td.addEventListener('blur', () => {
        const r = parseInt(td.dataset.r);
        const c = parseInt(td.dataset.c);
        tableData[r][c] = td.textContent;
        renderCode(); // コード追従
      });
      td.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          td.blur();
        }
      });
    });

    // アラインメント切替
    $previewBody.querySelectorAll('.align-indicator').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const c = parseInt(el.dataset.col);
        const cycle = ['left', 'center', 'right'];
        const idx = cycle.indexOf(alignments[c]);
        alignments[c] = cycle[(idx + 1) % 3];
        renderPreview();
        renderCode();
      });
    });
  }

  /* ============================================
     コード生成
     ============================================ */
  function renderCode() {
    if (!tableData.length) {
      $codeOutput.textContent = '';
      return;
    }

    let code;
    switch (format) {
      case 'markdown': code = toMarkdown(); break;
      case 'latex':    code = toLaTeX();    break;
      case 'html':     code = toHTML();     break;
    }
    $codeOutput.textContent = code;
  }

  /* --- Markdown --- */
  function toMarkdown() {
    const cols = Math.max(...tableData.map(r => r.length));
    const hasHeader = $optHeader.checked;

    // 列幅計算
    const widths = [];
    for (let c = 0; c < cols; c++) {
      let max = 3; // 最小幅
      for (const row of tableData) {
        const val = (row[c] || '').trim();
        // 文字幅を考慮（日本語は2幅）
        const w = [...val].reduce((s, ch) => s + (ch.charCodeAt(0) > 0x7F ? 2 : 1), 0);
        if (w > max) max = w;
      }
      widths.push(max);
    }

    const lines = [];

    tableData.forEach((row, r) => {
      const cells = [];
      for (let c = 0; c < cols; c++) {
        const val = (row[c] || '').trim();
        const w = [...val].reduce((s, ch) => s + (ch.charCodeAt(0) > 0x7F ? 2 : 1), 0);
        const pad = widths[c] - w;
        if (alignments[c] === 'right') {
          cells.push(' '.repeat(pad) + val);
        } else {
          cells.push(val + ' '.repeat(pad));
        }
      }
      lines.push('| ' + cells.join(' | ') + ' |');

      // ヘッダー直後にセパレータ
      if (hasHeader && r === 0) {
        const seps = [];
        for (let c = 0; c < cols; c++) {
          const w = widths[c];
          if (alignments[c] === 'right')       seps.push('-'.repeat(w - 1) + ':');
          else if (alignments[c] === 'center')  seps.push(':' + '-'.repeat(w - 2) + ':');
          else                                  seps.push('-'.repeat(w));
        }
        lines.push('| ' + seps.join(' | ') + ' |');
      }
    });

    // ヘッダーなしでも最低限セパレータ追加 (最初の行の後)
    if (!hasHeader && tableData.length > 0) {
      const seps = [];
      for (let c = 0; c < cols; c++) {
        const w = widths[c];
        if (alignments[c] === 'right')       seps.push('-'.repeat(w - 1) + ':');
        else if (alignments[c] === 'center')  seps.push(':' + '-'.repeat(w - 2) + ':');
        else                                  seps.push('-'.repeat(w));
      }
      lines.splice(1, 0, '| ' + seps.join(' | ') + ' |');
    }

    return lines.join('\n');
  }

  /* --- LaTeX --- */
  function toLaTeX() {
    const cols = Math.max(...tableData.map(r => r.length));
    const hasHeader = $optHeader.checked;

    const colSpec = alignments.slice(0, cols)
      .map(a => a === 'right' ? 'r' : a === 'center' ? 'c' : 'l')
      .join(' ');

    const lines = [];
    lines.push('\\begin{table}[htbp]');
    lines.push('  \\centering');
    lines.push(`  \\begin{tabular}{${colSpec}}`);
    lines.push('    \\hline');

    tableData.forEach((row, r) => {
      const cells = [];
      for (let c = 0; c < cols; c++) {
        cells.push(escLaTeX((row[c] || '').trim()));
      }
      lines.push('    ' + cells.join(' & ') + ' \\\\');
      if (hasHeader && r === 0) {
        lines.push('    \\hline');
      }
    });

    lines.push('    \\hline');
    lines.push('  \\end{tabular}');
    lines.push('  \\caption{}');
    lines.push('  \\label{tab:}');
    lines.push('\\end{table}');

    return lines.join('\n');
  }

  function escLaTeX(s) {
    return s.replace(/[&%$#_{}~^\\]/g, m => '\\' + m);
  }

  /* --- HTML --- */
  function toHTML() {
    const cols = Math.max(...tableData.map(r => r.length));
    const hasHeader = $optHeader.checked;

    const lines = [];
    lines.push('<table>');

    if (hasHeader && tableData.length > 0) {
      lines.push('  <thead>');
      lines.push('    <tr>');
      for (let c = 0; c < cols; c++) {
        const style = alignments[c] !== 'left' ? ` style="text-align: ${alignments[c]}"` : '';
        lines.push(`      <th${style}>${esc(tableData[0][c] || '')}</th>`);
      }
      lines.push('    </tr>');
      lines.push('  </thead>');
    }

    lines.push('  <tbody>');
    const startRow = hasHeader ? 1 : 0;
    for (let r = startRow; r < tableData.length; r++) {
      lines.push('    <tr>');
      for (let c = 0; c < cols; c++) {
        const style = alignments[c] !== 'left' ? ` style="text-align: ${alignments[c]}"` : '';
        lines.push(`      <td${style}>${esc(tableData[r][c] || '')}</td>`);
      }
      lines.push('    </tr>');
    }
    lines.push('  </tbody>');
    lines.push('</table>');

    return lines.join('\n');
  }

  /* ============================================
     ユーティリティ
     ============================================ */
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  let toastTimer = null;
  function showToast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 2000);
  }

  /* ============================================
     メイン処理
     ============================================ */
  function process() {
    tableData = parseTSV($tsvInput.value);
    alignments = guessAlignments(tableData);
    renderPreview();
    renderCode();
  }

  /* ============================================
     イベント
     ============================================ */
  $tsvInput.addEventListener('input', process);

  // フォーマット切替
  fmtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fmtBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      format = btn.dataset.fmt;
      $codeTitle.textContent = btn.textContent;
      renderCode();
    });
  });

  // ヘッダーオプション
  $optHeader.addEventListener('change', () => {
    alignments = guessAlignments(tableData);
    renderPreview();
    renderCode();
  });

  // 貼り付けボタン
  $btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        $tsvInput.value = text;
        process();
        showToast('📋 クリップボードから貼り付けました');
      }
    } catch {
      showToast('⚠ クリップボードの読み取り許可が必要です');
    }
  });

  // クリア
  $btnClear.addEventListener('click', () => {
    $tsvInput.value = '';
    tableData = [];
    alignments = [];
    renderPreview();
    renderCode();
  });

  // コピー
  $btnCopy.addEventListener('click', async () => {
    const code = $codeOutput.textContent;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      $btnCopy.classList.add('copied');
      $btnCopy.querySelector('.copy-label').textContent = 'コピー済';
      setTimeout(() => {
        $btnCopy.classList.remove('copied');
        $btnCopy.querySelector('.copy-label').textContent = 'コピー';
      }, 1500);
      showToast('📋 コピーしました');
    } catch {
      showToast('⚠ コピーに失敗しました');
    }
  });
})();
