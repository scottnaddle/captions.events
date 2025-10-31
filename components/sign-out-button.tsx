"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  )
}
