"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Radio, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Event {
  id: string
  uid: string
  title: string
  description: string | null
  created_at: string
}

interface EventsListProps {
  events: Event[]
}

export function EventsList({ events }: EventsListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyViewerLink = (uid: string) => {
    const link = `${window.location.origin}/view/${uid}`
    navigator.clipboard.writeText(link)
    setCopiedId(uid)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                {event.description && <CardDescription className="mt-1.5">{event.description}</CardDescription>}
                <p className="text-xs text-muted-foreground mt-2">
                  Created {new Date(event.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link href={`/broadcast/${event.uid}`}>
                  <Radio className="h-4 w-4 mr-2" />
                  Broadcast
                </Link>
              </Button>
              <Button variant="outline" onClick={() => copyViewerLink(event.uid)} className="flex-1">
                {copiedId === event.uid ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Viewer Link
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/view/${event.uid}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
