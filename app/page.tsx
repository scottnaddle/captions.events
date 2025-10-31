import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Captions, Mic, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Captions className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LiveCaptions</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Real-time captions for your live events
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Broadcast live captions to your audience with ease. Perfect for conferences, webinars, and presentations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start broadcasting</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Easy Broadcasting</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create an event and start broadcasting captions instantly to your audience
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Public Viewing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share a simple link for anyone to follow along with live captions
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Real-time Updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Captions appear instantly with smooth, real-time synchronization
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
