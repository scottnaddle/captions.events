import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    console.log("Creating test event...");

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const eventUid = `test-${Date.now()}`;

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: 'Translation Test Event',
        description: 'Test event for real-time translation',
        uid: eventUid
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Event created:', data);

    return NextResponse.json({
      success: true,
      event: data,
      viewerUrl: `http://localhost:3000/view/${data.uid}`,
      broadcastUrl: `http://localhost:3000/broadcast/${data.uid}`
    });
  } catch (error) {
    console.error('Error creating test event:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}