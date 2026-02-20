# MyApps デザイン定義書 (High-Quality Vibe Edition)

> **対象読者**: このプロジェクトのコードを生成する LLM（AI アシスタント）
> **目的**: ハウルさんの「Vibe Coding」を極限まで加速させる、最高品質の UI/UX 基準の定義。

---

## 🎨 デザイン哲学: Modern Glass & Depth 2.0

MyApps は、単なる便利ツールを超えた**「触れる芸術品」**を目指します。

### 1. 究極の「奥行き」 (Physical Layering)
- **浮遊感**: すべてのカードは `background: var(--c-surface-card)` を使い、フラットを避ける。
- **影の魔法**: 
  - 通常時: `box-shadow: var(--shadow-lg)`
  - ホバー時: `transform: translateY(-4px); box-shadow: var(--shadow-xl);`
- **一貫した角丸**: 原則として `border-radius: var(--r-2xl)` (16px以上) を使用し、モダンな柔らかさを出す。

### 2. インタラクティブ・フィードバック
- **ネオンフォーカス**: `input` や `textarea` へのフォーカス時は、`border-color: var(--c-accent)` と `box-shadow: 0 0 15px var(--c-accent-soft)` による発光エフェクトを必須とする。
- **ボタンの命**: クリック時は `transform: scale(0.98)`、ホバー時は `filter: brightness(1.1)` を適用。

---

## 🛠️ UI コンポーネントの鉄則

### 1. タイポグラフィ
- **フォント**: `DM Sans` + `Noto Sans JP`。
- **統計値**: 数字を扱う場合は `font-family: var(--font-mono)` かつ `font-weight: 800` で、圧倒的な視認性を確保する。

### 2. ツールバーとヘッダー
- 画面上部のツールバー（統計や操作ボタン）は `display: flex; justify-content: space-between;` で横並びにし、要素が詰まりすぎないよう `gap: var(--sp-6)` を確保する。

### 3. モーダルとオーバーレイ
- 半透明すぎると視認性が落ちるため、モーダル（設定画面等）は `background: var(--c-surface-solid)` をベースにし、背景の `backdrop-filter: blur(12px)` で奥行きを演出する。

---

## 🏷️ 日本語タグ & ローカライズ

- **`meta.json`**: タグは必ず**日本語**。説明文は「〜します」の丁寧語。
- **アイコンの一致**: `meta.json` の `icon` と、`shared/header.js` に渡す `data-app-icon` は必ず一致させる。

---

## ✅ 品質チェックリスト (Vibe Check)

- [ ] `shared/base.css` と `shared/header.js` を読み込んでいるか？
- [ ] ダークモード・ライトモードの両方で文字が読みやすいか？
- [ ] 重要なボタンに CSS が当たっているか？（デフォルトの灰色のままはNG）
- [ ] モバイル（幅 480px 以下）でレイアウトが崩れず、ボタンが押しやすいか？
- [ ] 余計な管理ファイル（TODO.md等）がリポジトリに含まれていないか（.gitignore）？

---

## ディレクトリ構造

```
MyApps/
├── index.html                  # Hub ページ
├── shared/                     # 共通アセット
├── apps/
│   ├── [app-id]/
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   ├── meta.json
│   │   └── favicon.svg
└── .gitignore                  # TODO.md などを除外
```
