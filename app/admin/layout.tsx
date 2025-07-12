import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Main Content - Full Width, No Navigation */}
      <main className="w-full p-4 bg-gray-50 min-h-screen">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  )
}
