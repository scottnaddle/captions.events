"use client";

import { useEffect, useRef, useState } from "react";

// Add this to ensure client-side only execution
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Languages, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { LANGUAGES } from "@/lib/languages";
import { LanguageSelector } from "@/components/language-selector";

interface Event {
  id: string;
  uid: string;
  title: string;
  description: string | null;
}

interface Caption {
  id: string;
  text: string;
  timestamp: string;
  language_code?: string;
  is_final: boolean;
}

interface ViewerPageProps {
  eventUid: string;
  event?: Event; // For backward compatibility
}

export function ViewerInterface({ eventUid }: ViewerPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [partialText, setPartialText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Simple translation state
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [translatedCaptions, setTranslatedCaptions] = useState<Map<string, string>>(new Map());
  const [translatedPartialText, setTranslatedPartialText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const supabase = getSupabaseBrowserClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simple language name display
  const getLanguageDisplayName = (code: string): string => {
    const displayNames: Record<string, string> = {
      'zh': 'Chinese',
      'en': 'English',
      'ko': 'Korean',
      'ja': 'Japanese',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
    };
    return displayNames[code] || code.toUpperCase();
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [captions, partialText, autoScroll]);

  // Load event via API
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventUid) return;

      try {
        console.log("🔍 Loading event via API:", eventUid);

        const response = await fetch(`/api/get-event?eventUid=${eventUid}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ Event loaded successfully via API:", data.event);

        setEvent(data.event);
      } catch (err) {
        console.error("❌ Error loading event via API:", err);
        setError(`Failed to load event: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventUid]);

  // Setup real-time subscription
  useEffect(() => {
    if (!event) return;

    const channel = supabase
      .channel(`captions:${event.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "captions",
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          console.log("New caption received:", payload);
          const newCaption = payload.new as Caption;
          setCaptions((prev) => {
            // Check if this caption already exists (avoid duplicates)
            if (prev.some((c) => c.id === newCaption.id)) {
              return prev;
            }
            return [...prev, newCaption];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transcripts",
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          console.log("Partial transcript received:", payload);
          if (payload.new.partial_transcript) {
            setPartialText(payload.new.partial_transcript);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event, supabase]);

  // Setup broadcast channel for real-time partial transcripts from broadcaster
  useEffect(() => {
    if (!event) return;

    const broadcastChannel = supabase
      .channel(`broadcast:${event.uid}`)
      .on("broadcast", { event: "partial_transcript" }, (payload) => {
        console.log("Received partial transcript from broadcast:", payload);
        if (payload.payload && payload.payload.text) {
          setPartialText(payload.payload.text);
        }
      })
      .subscribe((status) => {
        console.log("Broadcast channel status:", status);
      });

    return () => {
      supabase.removeChannel(broadcastChannel);
    };
  }, [event, supabase]);

  // Load existing captions
  useEffect(() => {
    if (!event) return;

    const loadCaptions = async () => {
      try {
        const { data, error } = await supabase
          .from("captions")
          .select("*")
          .eq("event_id", event.id)
          .order("timestamp", { ascending: true });

        if (error) throw error;

        // If no captions, add a test caption for translation testing
        if (!data || data.length === 0) {
          const testCaptions = [
            {
              id: 'test-1',
              text: 'Hello world, this is a test caption for translation',
              timestamp: new Date().toISOString(),
              event_id: event.id,
              is_final: true
            },
            {
              id: 'test-2',
              text: 'Welcome to the live caption translation demo',
              timestamp: new Date(Date.now() + 1000).toISOString(),
              event_id: event.id,
              is_final: true
            }
          ];
          setCaptions(testCaptions);
        } else {
          setCaptions(data || []);
        }
      } catch (err) {
        console.error("Error loading captions:", err);
        // Add test captions on error
        const testCaptions = [
          {
            id: 'test-1',
            text: 'Hello world, this is a test caption',
            timestamp: new Date().toISOString(),
            event_id: event.id,
            is_final: true
          }
        ];
        setCaptions(testCaptions);
      }
    };

    loadCaptions();
  }, [event, supabase]);

  // Simple translation function using only API
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      console.log(`🔄 Translating text: "${text}" to ${targetLang}`);

      const response = await fetch('/api/simple-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
        }),
      });

      console.log(`📡 Translation response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Translation API error: ${response.status} - ${errorText}`);
        throw new Error(`Translation error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Translation result: "${data.translation}"`);
      return data.translation || text;
    } catch (error) {
      console.error('❌ Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  // Translate captions when they change
  useEffect(() => {
    console.log(`🔍 Translation check: enabled=${translationEnabled}, targetLang=${targetLanguage}, captions=${captions.length}`);

    if (!translationEnabled || !targetLanguage || targetLanguage === "none") {
      console.log("❌ Translation skipped - conditions not met");
      return;
    }

    const translateNewCaptions = async () => {
      const untranslatedCaptions = captions.filter(caption => !translatedCaptions.has(caption.id));

      console.log(`📝 Found ${untranslatedCaptions.length} captions to translate`);

      if (untranslatedCaptions.length === 0) return;

      setIsTranslating(true);

      try {
        const newTranslations = new Map<string, string>();

        for (const caption of untranslatedCaptions.slice(-2)) { // Only translate last 2 for testing
          console.log(`🔄 Translating caption: ${caption.id} - "${caption.text}"`);
          const translated = await translateText(caption.text, targetLanguage);
          newTranslations.set(caption.id, translated);
          console.log(`✅ Translation completed for ${caption.id}`);
        }

        setTranslatedCaptions(prev => new Map([...prev, ...newTranslations]));
        console.log(`💾 Saved ${newTranslations.size} translations`);
      } finally {
        setIsTranslating(false);
      }
    };

    translateNewCaptions();
  }, [captions, translationEnabled, targetLanguage]);

  // Translate partial text with debounce
  useEffect(() => {
    if (!translationEnabled || !targetLanguage || !partialText || targetLanguage === "none") {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const translated = await translateText(partialText, targetLanguage);
        setTranslatedPartialText(translated);
      } catch (error) {
        console.error('Error translating partial text:', error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [partialText, translationEnabled, targetLanguage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading captions...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error || "Event not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoScroll(!autoScroll)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Translation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Translation Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <LanguageSelector
                  value={translationEnabled ? targetLanguage : null}
                  defaultOption={{ value: null, label: "Select language" }}
                  onValueChange={(value) => {
                    if (value === null || value === "none") {
                      setTranslationEnabled(false);
                    } else {
                      setTranslationEnabled(true);
                      setTargetLanguage(value);
                    }
                  }}
                />
              </div>
              {isTranslating && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Translating...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Captions Display */}
        <Card>
          <CardHeader>
            <CardTitle>
              Live Captions
              {translationEnabled && (
                <span className="text-base font-normal text-muted-foreground ml-2">
                  (Translated to {LANGUAGES.find((l) => l.code === targetLanguage)?.name || targetLanguage})
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {translationEnabled
                ? "Original captions and translations will appear side by side"
                : "Captions will appear here in real-time"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={scrollContainerRef}
              className="bg-background border-2 rounded-lg p-6 min-h-[500px] max-h-[600px] overflow-y-auto"
            >
              {translationEnabled ? (
                // Side by side view
                <div className="space-y-4">
                  {captions.map((caption) => {
                    const timestamp = new Date(
                      caption.timestamp
                    ).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    const translatedText = translatedCaptions.get(caption.id);

                    return (
                      <div
                        key={caption.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {/* Original */}
                        <div className="p-3 rounded border bg-muted/30">
                          <div className="text-xs text-muted-foreground mb-1">
                            {timestamp}
                          </div>
                          <div className="text-base leading-relaxed">{caption.text}</div>
                        </div>
                        {/* Translation */}
                        <div className="p-3 rounded border bg-blue-50/50 dark:bg-blue-950/30">
                          <div className="text-xs text-muted-foreground mb-1">
                            {timestamp}
                          </div>
                          <div className="text-base leading-relaxed">
                            {translatedText || (
                              <span className="text-muted-foreground italic">Translating...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {partialText && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original partial */}
                      <div className="p-3 rounded border border-primary/20 bg-primary/5">
                        <div className="text-xs text-primary/50 mb-1">
                          Live
                        </div>
                        <div className="text-base leading-relaxed italic text-primary/70">
                          {partialText}
                        </div>
                      </div>
                      {/* Translated partial */}
                      <div className="p-3 rounded border border-blue-200/30 bg-blue-50/50 dark:border-blue-800/30">
                        <div className="text-xs text-blue-600/50 dark:text-blue-400/50 mb-1">
                          Live
                        </div>
                        <div className="text-base leading-relaxed italic text-blue-600/70 dark:text-blue-400/70">
                          {translatedPartialText || (
                            <span className="text-muted-foreground italic">Translating...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Single column view (original only)
                <div className="space-y-3">
                  {captions.map((caption) => {
                    const timestamp = new Date(
                      caption.timestamp
                    ).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });

                    return (
                      <div
                        key={caption.id}
                        className="p-3 rounded border bg-muted/30"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {timestamp}
                        </div>
                        <div className="text-lg leading-relaxed">{caption.text}</div>
                      </div>
                    );
                  })}
                  {partialText && (
                    <div className="p-3 rounded border border-primary/20 bg-primary/5">
                      <div className="text-xs text-primary/50 mb-1">
                        Live
                      </div>
                      <div className="text-lg leading-relaxed italic text-primary/70">
                        {partialText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}