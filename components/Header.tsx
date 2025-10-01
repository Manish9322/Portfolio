"use client"

import Link from "next/link"
import { useGetProfileQuery } from "@/services/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  backLink?: string
  backText?: string
  showBackButton?: boolean
  className?: string
}

export const Header = ({ 
  backLink = "/", 
  backText = "Home", 
  showBackButton = true,
  className = ""
}: HeaderProps) => {
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left section - Back button or spacer */}
          <div className="flex-shrink-0 w-16 sm:w-20 md:w-24">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="p-1 sm:p-2 hover:bg-accent/50 transition-colors"
              >
                <Link href={backLink} className="flex items-center">
                  <ArrowLeft className="h-4 w-4 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline text-sm md:text-base truncate">
                    {backText}
                  </span>
                </Link>
              </Button>
            )}
          </div>
          
          {/* Center section - Profile name */}
          <div className="flex-1 text-center min-w-0 px-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
              {profileData?.name || "Manish Sonawane"}
            </h1>
          </div>
          
          {/* Right section - Spacer for balance */}
          <div className="flex-shrink-0 w-16 sm:w-20 md:w-24">
            {/* This div provides balance to center the title */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
