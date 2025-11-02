import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try {
        // Verify user is authenticated
        const supabase = await getSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth
            .getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Get the event UID from query params
        const searchParams = request.nextUrl.searchParams;
        const eventUid = searchParams.get("eventUid");

        if (eventUid) {
            // Verify the user owns this event
            const { data: event, error: eventError } = await supabase
                .from("events")
                .select("creator_id")
                .eq("uid", eventUid)
                .single();

            if (eventError || !event) {
                return NextResponse.json(
                    { error: "Event not found" },
                    { status: 404 },
                );
            }

            if (event.creator_id !== user.id) {
                return NextResponse.json(
                    { error: "Unauthorized - not event owner" },
                    { status: 403 },
                );
            }
        }

        // Generate single-use token from ElevenLabs API
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            console.error("ELEVENLABS_API_KEY is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 },
            );
        }

        const response = await fetch(
            "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe",
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                },
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs API error:", errorText);
            return NextResponse.json(
                { error: "Failed to generate token" },
                { status: response.status },
            );
        }

        const data = await response.json();

        return NextResponse.json({ token: data.token });
    } catch (error) {
        console.error("Error generating scribe token:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
