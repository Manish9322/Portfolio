"use client"

import Link from "next/link"
import { useGetProfileQuery } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  backLink?: string
  backText?: string
  showBackButton?: boolean
}

export const Header = ({ backLink = "/", backText = "Home", showBackButton = true }: HeaderProps) => {
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {showBackButton && (
            <Button variant="ghost" asChild>
              <Link href={backLink}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backText}
              </Link>
            </Button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold">
              {profileData?.name || "Manish Sonawane"}
            </h1>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>
    </header>
  )
}

export default Header
