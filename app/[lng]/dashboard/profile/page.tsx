import { redirect } from "next/navigation"
import { getServerSession, getServerUserProfile, createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  // Get the session on the server
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Get the user profile
  const profile = await getServerUserProfile(session.user.id)

  if (!profile) {
    // Create a profile if it doesn't exist
    const supabase = await createClient()
    await supabase.from("profiles").insert({
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata.full_name || null,
      avatar_url: session.user.user_metadata.avatar_url || null,
      created_at: new Date().toISOString(),
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" description="Manage your account settings" />
      <div className="grid gap-10">
        <ProfileForm userId={session.user.id} initialProfile={profile} />
      </div>
    </DashboardShell>
  )
}
