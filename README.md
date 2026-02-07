# The Arena (GitHub Pages 表示手順)

このリポジトリは Vite + React アプリです。**GitHub Pages で表示するには `GitHub Actions` デプロイを使ってください。**

## 本番表示の手順

1. GitHub で `Settings > Pages` を開く
2. `Build and deployment` を `GitHub Actions` に設定
3. `Actions` タブで `Deploy to GitHub Pages` ワークフローが成功するのを確認
4. 次のURLを開く
   - `https://jonsonpanson114.github.io/book/`

## うまく表示されない場合

- `Actions` の失敗ログを確認（依存解決、ビルド失敗）
- 反映まで1〜5分待って再読み込み
- `/docs` 配信設定の場合は `docs/index.html` のフォールバックが表示されます

## ローカル実行

```bash
npm install
npm run dev
```

> この実行環境では npm レジストリ制限により `npm install` が失敗することがあります。
