"use client"

import { Home, Plus, Calendar } from "lucide-react"

interface BottomNavigationProps {
  currentPage: "home" | "add" | "calendar"
  onNavigate: (page: "home" | "add" | "calendar") => void
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "add", label: "Add Expense", icon: Plus },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as "home" | "add" | "calendar")}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-colors rounded-2xl mx-2 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
