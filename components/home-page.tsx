"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { Expense } from "@/types/expense"

interface HomePageProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍔",
  Transportation: "🚗",
  Rent: "💡",
  Entertainment: "🎬",
  Health: "🏥",
  Shopping: "🛍️",
  Other: "📌",
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#0af244ff",
  Transportation: "#4ecdc4",
  Rent: "#848484ff",
  Entertainment: "#1bb7e7ff",
  Shopping: "#f30400ff",
  Other: "#ccfc0aff",
}

export function HomePage({ expenses, onDeleteExpense }: HomePageProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM

  const months = useMemo(() => {
    const monthSet = new Set(expenses.map(expense => expense.date.slice(0, 7)))
    const currentMonth = new Date().toISOString().slice(0, 7)
    monthSet.add(currentMonth) // Always include current month

    // Add next month if there are expenses in future months
    const nextMonthDate = new Date()
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    const nextMonth = nextMonthDate.toISOString().slice(0, 7)
    if (Array.from(monthSet).some(m => m > currentMonth)) {
      monthSet.add(nextMonth)
    }

    const sortedMonths = Array.from(monthSet).sort().reverse() // Most recent first

    return sortedMonths.map(value => {
      const date = new Date(value + '-01')
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      return { value, label }
    })
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => expense.date.startsWith(selectedMonth))
  }, [expenses, selectedMonth])

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filteredExpenses])

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredExpenses])

  const formattedTotal = totalExpenses.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const currentMonth = new Date(selectedMonth + '-01').toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {}
    sortedExpenses.forEach((expense) => {
      const dateKey = new Date(expense.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(expense)
    })
    return groups
  }, [sortedExpenses])

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    filteredExpenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount
    })
    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category] || "#ccc"
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [filteredExpenses])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden pb-20">
      <div className="bg-gradient-to-br from-primary to-primary/90 px-6 pt-8 pb-8 rounded-b-3xl safe-area-inset-top">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-4xl font-bold text-primary-foreground">Expense Tracker</h1>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40 bg-white/20 border-white/30 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-auto">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium flex items-center gap-2 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17H6v-4m0 0H2m4 4v4m8-17h6v4m0 0h4m-4-4v-4m0 0V3"
                  />
                </svg>
                Total Spending
              </p>
              <h2 className="text-4xl font-bold text-primary-foreground">${formattedTotal}</h2>
            </div>
          </div>
          <p className="text-primary-foreground/70 text-sm">{currentMonth}</p>
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Spending by Category</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-lg flex-shrink-0">📊</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Total Spending</span>
                  <span className="text-sm text-muted-foreground">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-4 flex overflow-hidden">
                  {categoryTotals.map((item) => {
                    const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
                    return (
                      <div
                        key={item.category}
                        className="h-4 transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                        title={`${item.category}: $${item.amount.toFixed(2)} (${percentage.toFixed(1)}%)`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              {categoryTotals.map((item) => (
                <div key={item.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="text-foreground font-medium">${item.amount.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {sortedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
            <div className="text-5xl">📊</div>
            <p className="text-foreground font-semibold text-center">No expenses yet</p>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              Start tracking your spending by adding your first expense
            </p>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6">
            {Object.entries(groupedExpenses).map(([dateKey, dayExpenses]) => (
              <div key={dateKey}>
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{dateKey}</h3>
                  <p className="text-xs text-muted-foreground">{dayExpenses.length} total</p>
                </div>

                <div className="space-y-3">
                  {dayExpenses.map((expense) => (
                    <Card key={expense.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-2" onClick={() => { setSelectedExpense(expense); setIsDialogOpen(true); }}>
                        <div className="flex items-center gap-2">
                          <div className="text-xl flex-shrink-0">{CATEGORY_ICONS[expense.category] || "📌"}</div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{expense.category}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="font-bold text-destructive text-sm">-${expense.amount.toFixed(2)}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDeleteExpense(expense.id); }}
                              className="p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
                              aria-label="Delete expense"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedExpense?.category} - ${selectedExpense?.amount.toFixed(2)}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {selectedExpense?.description || "No description provided."}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
