import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventUid = searchParams.get('eventUid');

    console.log("🔍 Debug event lookup for:", eventUid);
    console.log("🔑 Supabase URL:", supabaseUrl);
    console.log("🔑 Anon Key exists:", !!supabaseKey);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    console.log("📊 Connection test:", { connectionTest, connectionError });

    if (connectionError) {
      return NextResponse.json({
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 });
    }

    // Try to find the specific event
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('uid', eventUid)
      .limit(1);

    console.log("📋 Event lookup result:", { events, error });

    // Also check total events
    const { data: allEvents, error: allError } = await supabase
      .from('events')
      .select('uid, title')
      .limit(10);

    console.log("📋 All events:", { allEvents, allError });

    return NextResponse.json({
      eventUid,
      found: events && events.length > 0,
      event: events?.[0] || null,
      allEvents: allEvents || [],
      error: error?.message || null,
      connectionTest: {
        success: !connectionError,
        error: connectionError?.message || null
      }
    });

  } catch (error) {
    console.error("❌ Debug error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}