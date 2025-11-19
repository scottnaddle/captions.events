import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🔄 Simple Translation API called");

  try {
    const body = await request.json();
    console.log("📥 Request body:", body);

    const { text, targetLanguage } = body;

    if (!text || !targetLanguage) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    // Use MyMemory Translation API (free, no API key required)
    console.log("🔄 Translating text:", text, "to:", targetLanguage);

    try {
      // MyMemory API - 1000 requests/day free, no API key needed
      const translationResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TranslationApp/1.0)',
          }
        }
      );

      if (translationResponse.ok) {
        const translationData = await translationResponse.json();
        if (translationData && translationData.responseStatus === 200 && translationData.responseData.translatedText) {
          const translation = translationData.responseData.translatedText;
          console.log(`✅ MyMemory translation result: "${translation}"`);
          return NextResponse.json({ translation });
        }
      }
    } catch (translateError) {
      console.log("⚠️ MyMemory API failed, trying fallback:", translateError);
    }

    try {
      // Fallback to LibreTranslate API (if available)
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLanguage,
          format: 'text'
        })
      });

      if (libreResponse.ok) {
        const libreData = await libreResponse.json();
        if (libreData && libreData.translatedText) {
          const translation = libreData.translatedText;
          console.log(`✅ LibreTranslate translation result: "${translation}"`);
          return NextResponse.json({ translation });
        }
      }
    } catch (libreError) {
      console.log("⚠️ LibreTranslate API failed, using local fallback:", libreError);
    }

    // Local fallback: Basic word mapping for common languages
    const wordTranslations: Record<string, Record<string, string>> = {
      'ko': {
        'hello': '안녕하세요',
        'world': '세계',
        'welcome': '환영합니다',
        'this': '이것은',
        'is': '입니다',
        'test': '테스트',
        'caption': '자막',
        'live': '실시간',
        'translation': '번역',
        'demo': '데모',
        'working': '작동 중입니다',
        'thank': '감사합니다',
        'you': '당신을',
        'please': '제발',
        'yes': '예',
        'no': '아니오',
        'good': '좋은',
        'bad': '나쁜',
        'help': '도움',
        'error': '오류',
        'success': '성공'
      },
      'es': {
        'hello': 'hola',
        'world': 'mundo',
        'welcome': 'bienvenido',
        'this': 'esto',
        'is': 'es',
        'test': 'prueba',
        'caption': 'subtítulo',
        'live': 'en vivo',
        'translation': 'traducción',
        'demo': 'demostración',
        'working': 'funcionando',
        'thank': 'gracias',
        'you': 'tú',
        'please': 'por favor',
        'yes': 'sí',
        'no': 'no',
        'good': 'bueno',
        'bad': 'malo',
        'help': 'ayuda',
        'error': 'error',
        'success': 'éxito'
      },
      'fr': {
        'hello': 'bonjour',
        'world': 'monde',
        'welcome': 'bienvenue',
        'this': 'ceci',
        'is': 'est',
        'test': 'test',
        'caption': 'sous-titre',
        'live': 'en direct',
        'translation': 'traduction',
        'demo': 'démonstration',
        'working': 'fonctionne',
        'thank': 'merci',
        'you': 'vous',
        'please': 's\'il vous plaît',
        'yes': 'oui',
        'no': 'non',
        'good': 'bon',
        'bad': 'mauvais',
        'help': 'aide',
        'error': 'erreur',
        'success': 'succès'
      },
      'ja': {
        'hello': 'こんにちは',
        'world': '世界',
        'welcome': 'ようこそ',
        'this': 'これは',
        'is': 'です',
        'test': 'テスト',
        'caption': 'キャプション',
        'live': 'ライブ',
        'translation': '翻訳',
        'demo': 'デモ',
        'working': '動作中',
        'thank': 'ありがとう',
        'you': 'あなた',
        'please': 'お願いします',
        'yes': 'はい',
        'no': 'いいえ',
        'good': '良い',
        'bad': '悪い',
        'help': '助け',
        'error': 'エラー',
        'success': '成功'
      },
      'zh': {
        'hello': '你好',
        'world': '世界',
        'welcome': '欢迎',
        'this': '这是',
        'is': '是',
        'test': '测试',
        'caption': '字幕',
        'live': '直播',
        'translation': '翻译',
        'demo': '演示',
        'working': '工作正常',
        'thank': '谢谢',
        'you': '你',
        'please': '请',
        'yes': '是',
        'no': '否',
        'good': '好',
        'bad': '坏',
        'help': '帮助',
        'error': '错误',
        'success': '成功'
      }
    };

    const translationMap = wordTranslations[targetLanguage];
    if (translationMap) {
      // Word-by-word translation with basic grammar
      const words = text.toLowerCase().split(' ');
      const translatedWords = words.map(word => {
        const cleanWord = word.replace(/[.,!?;:]/g, '').trim();
        const punctuation = word.replace(/[a-zA-Z]/g, '');

        if (translationMap[cleanWord]) {
          return translationMap[cleanWord] + punctuation;
        }
        return word; // Keep original if no translation
      });

      const translation = translatedWords.join(' ');
      console.log(`✅ Local translation result: "${translation}"`);
      return NextResponse.json({ translation });
    }

    // Final fallback - indicate it couldn't be translated
    const languageNames: Record<string, string> = {
      'ko': 'Korean',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'zh': 'Chinese',
      'ru': 'Russian',
      'pt': 'Portuguese',
      'it': 'Italian',
      'ar': 'Arabic'
    };

    const languageName = languageNames[targetLanguage] || targetLanguage.toUpperCase();
    const translation = `[${languageName}] ${text}`;
    console.log(`✅ Final fallback: "${translation}"`);
    return NextResponse.json({ translation });
  } catch (error) {
    console.error("❌ Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}