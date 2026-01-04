"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Expense } from "@/types/expense"

interface CalendarPageProps {
  expenses: Expense[]
}

export function CalendarPage({ expenses }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const totals: Record<number, number> = {}
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date)
      if (expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === currentMonth) {
        const day = expenseDate.getDate()
        totals[day] = (totals[day] || 0) + expense.amount
      }
    })
    return totals
  }, [expenses, currentYear, currentMonth])

  // Generate calendar grid
  const calendarDays = []
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
    const amount = isCurrentMonth ? dailyTotals[dayNumber] || 0 : 0

    calendarDays.push({
      day: isCurrentMonth ? dayNumber : null,
      amount,
      isCurrentMonth,
    })
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden pb-20">
      <div className="bg-gradient-to-br from-primary to-primary/90 px-6 pt-8 pb-8 rounded-b-3xl safe-area-inset-top">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-primary-foreground hover:bg-white/10 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-foreground">Calendar</h1>
            <p className="text-primary-foreground/70 text-sm font-medium mt-1">{monthName}</p>
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 text-primary-foreground hover:bg-white/10 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="px-6 py-6 w-full">
          <div className="max-w-md mx-auto bg-card rounded-2xl p-6 shadow-sm border">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2 uppercase tracking-wide">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-200 ${
                    day.isCurrentMonth
                      ? day.amount > 0
                        ? "bg-primary/5 border-primary/30 text-primary shadow-sm"
                        : "bg-background border-border/50 text-foreground hover:bg-secondary/30"
                      : "border-transparent text-muted-foreground/40"
                  }`}
                >
                  {day.day && (
                    <>
                      <span className={`font-medium text-sm ${day.amount > 0 ? 'text-primary' : 'text-foreground'}`}>
                        {day.day}
                      </span>
                      {day.amount > 0 && (
                        <span className="font-bold text-destructive text-[10px] leading-tight">
                          ${day.amount.toFixed(0)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}