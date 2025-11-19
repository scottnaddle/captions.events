import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: 'Test Translation Event',
        description: 'Test event for translation functionality',
        uid: `test-${Date.now()}`
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Test event created successfully',
      event: data,
      viewerUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/view/${data.uid}`
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}