import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const isConfigured = !!process.env.GEMINI_API_KEY;

    return NextResponse.json({
      configured: isConfigured,
      message: isConfigured ? "Gemini API is configured" : "Gemini API key is not configured"
    });
  } catch (error) {
    console.error("Error checking Gemini status:", error);
    return NextResponse.json(
      { error: "Failed to check Gemini status" },
      { status: 500 }
    );
  }
}