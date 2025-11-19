import { ViewerInterface } from "@/components/viewer-interface"
import { Captions } from "lucide-react"

interface ViewPageProps {
  params: Promise<{
    uid: string
  }>
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { uid } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Captions className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LiveCaptions</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ViewerInterface eventUid={uid} />
      </main>
    </div>
  )
}
