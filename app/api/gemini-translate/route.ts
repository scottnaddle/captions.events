import { NextRequest, NextResponse } from "next/server";

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export async function POST(request: NextRequest) {
  console.log("🔄 Translation API called");

  try {
    const { text, targetLanguage, sourceLanguage }: TranslationRequest = await request.json();
    console.log("📥 Request:", { text, targetLanguage, sourceLanguage });

    if (!text || !targetLanguage) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔑 API Key exists:", !!apiKey);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Translation service not available" },
        { status: 500 }
      );
    }

    // Simple language name mapping
    const getLanguageName = (code: string): string => {
      const languages: Record<string, string> = {
        'ko': 'Korean',
        'en': 'English',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ar': 'Arabic',
        'hi': 'Hindi',
      };
      return languages[code] || code;
    };

    // Create translation prompt
    const sourceLanguageName = sourceLanguage ? getLanguageName(sourceLanguage) : 'detected language';
    const targetLanguageName = getLanguageName(targetLanguage);

    const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Return only the translation:

${text}`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return NextResponse.json(
        { error: "Translation service temporarily unavailable" },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const translation = data.candidates[0].content.parts[0].text.trim();
      return NextResponse.json({ translation });
    } else {
      return NextResponse.json(
        { error: "Translation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}