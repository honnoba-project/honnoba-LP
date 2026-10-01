# ホンノバ LP — 最新コード

2026年10月1日のレスポンシブ対応済み公開版です。
元コミット: e0c0c88e2acdbb2c8317f81945849adb8c1a9dcc

## ローカルで表示

VS Codeのターミナルで以下を実行し、http://localhost:4173 を開いてください。

```sh
python3 -m http.server 4173 --directory dist
```

停止する場合は Ctrl+C。ビルドや npm install は不要です。
VS Codeの「ターミナル → タスクの実行 → ホンノバをプレビュー」でも起動できます。

## 編集するファイル

- dist/index.html: トップページ
- dist/contact.html: お問い合わせページ
- dist/style.css / refresh.css / responsive.css: デザインと画面幅ごとの配置
- dist/motion.css / motion.js: 出現アニメーション
- dist/book.js: スクロールに連動する本のページめくり
- dist/app.js: メニュー、ダイアログ、フォーム
- dist/assets/: イラスト・写真・動画

動画は操作UIなしで自動ループ。ステップ間の矢印は静止し、透明度は上から40%、70%、100%です。
アプリへのリンクは https://kamiyama.honnoba.jp/ です。
お問い合わせフォームは未接続で、外部送信しません。準備中のリンクや詳細内容は現状のままです。

このフォルダは独立した書き出し用コピーです。編集内容が公開サイトへ自動反映されることはありません。
DESIGN-NOTES.mdとasset-sources.jsonは既存の制作資料です。
