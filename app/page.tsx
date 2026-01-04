"use client"

import { useState, useEffect } from "react"
import { HomePage } from "@/components/home-page"
import { AddExpensePage } from "@/components/add-expense-page"
import { CalendarPage } from "@/components/calendar-page"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useExpenses } from "@/hooks/use-expenses"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "add" | "calendar">("home")
  const { expenses, addExpense, deleteExpense } = useExpenses()
  const [mounted, setMounted] = useState(false)

  // Ensure we only render after hydration to avoid mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {currentPage === "home" ? (
        <HomePage expenses={expenses} onDeleteExpense={deleteExpense} />
      ) : currentPage === "calendar" ? (
        <CalendarPage expenses={expenses} />
      ) : (
        <AddExpensePage
          onExpenseAdded={(expense) => {
            addExpense(expense)
            setCurrentPage("home")
          }}
        />
      )}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}
