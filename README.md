# 🎤 VoiceMeme

AI × TTS × エフェクトで声メメを作るモバイルアプリ。

## 概要

VoiceMemeは、AIで台本を生成し、TTSで読み上げ、声エフェクトをかけて面白いボイスメメを作成するアプリです。

### 主な機能

- 🤖 **AI台本生成** — GLM-5でテーマに応じた台本を自動生成
- 🗣️ **TTS読み上げ** — Edge TTSで自然な日本語音声を合成
- 🎛️ **声エフェクト** — ピッチシフト・フォルマント変換で声を変化
- ⏱️ **LRCタイムスタンプ** — セグメントごとのタイムスタンプ自動生成
- 📤 **エクスポート＆シェア** — 作成したメメを簡単シェア

## 技術スタック

- **Framework:** React Native + Expo SDK 55
- **Language:** TypeScript (strict mode)
- **Routing:** Expo Router (file-based)
- **State:** React hooks
- **Audio:** expo-av
- **TTS:** Edge TTS
- **AI:** GLM-5

## プロジェクト構成

```
VoiceMeme/
├── app/                    # Expo Router (画面)
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # 作成画面
│   │   ├── library.tsx    # ライブラリ画面
│   │   └── settings.tsx   # 設定画面
│   └── _layout.tsx        # ルートレイアウト
├── src/
│   ├── ai/                # AI台本生成 (GLM-5)
│   ├── audio/             # 音声処理ユーティリティ
│   ├── components/        # 再利用可能UIコンポーネント
│   ├── constants/         # アプリ定数
│   ├── effects/           # 声エフェクト (ピッチ・フォルマント)
│   ├── hooks/             # カスタムReactフック
│   ├── lrc/               # LRCタイムスタンプ生成
│   ├── screens/           # 画面コンポーネント
│   ├── tts/               # TTS連携 (Edge TTS)
│   ├── types/             # TypeScript型定義
│   └── utils/             # 汎用ユーティリティ
└── assets/                # 画像・アイコン等
```

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm start

# iOS/Android/Webでプレビュー
npm run ios
npm run android
npm run web
```

## 開発ロードマップ

- [x] Issue #1: プロジェクト構成・ビルド環境セットアップ
- [ ] Issue #2: AI台本生成モジュール（GLM-5連携）
- [ ] Issue #3: TTS読み上げモジュール（Edge TTS連携）
- [ ] Issue #4: 声エフェクトモジュール（ピッチシフト・フォルマント）
- [ ] Issue #5: LRCタイムスタンプ生成モジュール
- [ ] Issue #6: UI/UXデザイン（モバイルファースト）
- [ ] Issue #7: エクスポート＆シェア機能
- [ ] Issue #8: E2Eテスト

## License

MIT
