# 🎙️ VoiceMeme

AI台本生成 → TTS読み上げ → 声エフェクト → 音声+LRC出力

声いじりミーム動画の**音声制作**を1タップで完結させるモバイルアプリ。

## Features

- **AI台本生成**: GLM-5 がテーマに沿った台本を自動作成
- **TTS読み上げ**: Edge TTS で台本を音声化
- **声エフェクト**: ピッチシフト・フォルマント変換で声を加工（ロボット風、ラジオ風、ハイテンション等）
- **LRC出力**: タイムスタンプ付きテキスト → 字幕作成に活用
- **シェア用テキスト**: SNS投稿用テキストも自動生成

## Output

- 音声ファイル (MP3/WAV)
- LRC ファイル（タイムスタンプ付き）
- 台本テキスト

## Tech Stack

| Layer | Tech |
|-------|------|
| Mobile UI | React Native |
| Script Generation | GLM-5 |
| TTS | Edge TTS |
| Audio Processing | JUCE (C++) Native Module |
| LRC Generation | Forced Alignment |

## Safety Scope (v1)

- ✅ AI生成台本のみ（ユーザー入力は補助）
- ✅ TTS合成音声へのエフェクトのみ
- ✅ 汎用エフェクト名（誰かの真似を示唆しない）
- ❌ マイク入力はv2で検討
- ❌ 有名人の名前を冠したプリセットは不可

## License

MIT
