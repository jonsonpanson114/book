# プロジェクト: Jinnai - 思考の格闘技（読書ノートアプリ）
## Claude Code 向け：完全再構築・実装計画書

**指令**: 既存のコードベースは破棄し、**ゼロから新規プロジェクトとして** このアプリを構築せよ。
**目的**: ユーザーの思考を挑発し、深めるための「知的スパーリングパートナー（陣内）」を搭載した読書管理アプリを作成する。

---

### 1. プロジェクト概要 & コアコンセプト
このアプリは単なるメモ帳ではない。「陣内（Jinnai）」というAI人格が、ユーザーの入力に対して批判的・洞察的なフィードバックを行い、思考の質を高めることが目的である。

#### AIペルソナ「陣内 (Jinnai)」の定義
*   **性格**: 尊大、自信家、ニヒリストだが、核心を突く知性を持つ。「俺」「お前」口調。
*   **役割**: ユーザーを「安易な結論」から引きずり出し、思考の泥沼（アリーナ）へ引きずり込む。
*   **3つの介入モード**:
    1.  **悪魔の代弁者 (Devil's Advocate)**: ユーザーが何かを肯定すると、あえて否定的な側面や矛盾を指摘する。
    2.  **行動の強制 (Action Trigger)**: 抽象的な「学び」を書くと、「で、具体的にいつ動くんだ？」と行動を迫る。
    3.  **セレンディピティ (Serendipity)**: 全く関係ない分野（映画、歴史、登山など）の知識と結びつけ、意外な視点を提供する。

### 2. 技術スタック (Strict Rules)
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Styling**: **Tailwind CSS v3** (v4はまだ不安定なため使用禁止)
*   **Icons**: Lucide React
*   **Animation**: Framer Motion
*   **State Management**: React Context or Hooks (No Redux)
*   **Build Tool**: Vite (Default configuration)

### 3. 実装ステップ (Step-by-Step)

#### Phase 0: 環境構築 (Clean Start)
1.  **新規プロジェクト作成**:
    ```bash
    npm create vite@latest books-new -- --template react-ts
    cd books-new
    npm install -D tailwindcss@3 postcss autoprefixer
    npx tailwindcss init -p
    npm install lucide-react framer-motion clsx tailwind-merge
    ```
    *※既存の `books` ディレクトリではなく、新しいディレクトリで始めること。*
2.  **Tailwind設定**: `content` パスを正しく設定し、ダークグレイッシュブルー (`#0f172a`) ベースのテーマを定義する。

#### Phase 1: 基盤コンポーネント (The Arena)
*   **AppShell**: サイドバー（ナビゲーション）とメインエリアを持つレイアウト。
    *   *要件*: ガラスモーフィズム (Glassmorphism) を採用した、知的で重厚なデザイン。
*   **Book Data Model**:
    *   `id`, `title`, `author`, `status` ('reading', 'finished'), `notes`, `tags`
*   **Store (Hooks)**: `useBooks` フックを作成し、ローカルステート（将来的にはLocalStorage）で本とノートを管理する。

#### Phase 2: コア機能実装
1.  **Bookshelf (本棚)**:
    *   登録された本の表紙（色付きの短冊）が並ぶ画面。
    *   本をクリックすると「アリーナ（編集画面）」へ遷移する。
2.  **Arena (ノートエディタ)**:
    *   左側：陣内とのチャットインタフェース。
    *   右側：マークダウンライクなメモ帳。
    *   **タグ管理UI**: タグの追加・削除機能。

#### Phase 3: "Jinnai" ロジックの実装
*   **`useJinnai` Hook**:
    *   ユーザーの入力を監視する。
    *   **キーワード検知**: 「計画」「成長」「重要」などの単語に反応する。
    *   **タイマー介入**: 一定時間入力が止まると、「手が止まっているぞ。悩みすぎだ」と介入する。
*   **UIフィードバック**: 陣内が話すとき、アイコンが微かに光る、またはテキストがタイプライター風に表示される演出。

### 4. デザインガイドライン
*   **カラーパレット**:
    *   Background: Deep Navy (`#0a0f1c`)
    *   Accent: Intellectual Blue (`#3b82f6`) & Warning Yellow (`#f59e0b`)
    *   Text: Slate Gray (`#94a3b8`) ~ White
*   **フォント**: 日本語フォント（Noto Sans JP等）を適切に指定し、読みやすさを確保する。

### 5. Claude Code への申し送り
*   **ファイルシステム**: ブラウザ環境向けのコードを書くこと。`fs` は使わない。
*   **ポート**: ローカルサーバー起動時は、ポートの競合（ゾンビプロセス）に注意し、空いているポートを探すロジックを入れるか、手動で確認する。
*   **確認**, **確認**, **確認**: 1つの機能を実装するたびに、ブラウザで動作確認（画面が真っ白になっていないか）を行うこと。

---
**Good Luck. 陣内をこの世に解き放て。**
