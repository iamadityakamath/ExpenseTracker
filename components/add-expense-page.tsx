"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Expense } from "@/types/expense"

const CATEGORIES = [
  { name: "Food", emoji: "🍕" },
  { name: "Transportation", emoji: "🚗" },
  { name: "Rent", emoji: "💡" },
  { name: "Entertainment", emoji: "🎬" },
  { name: "Shopping", emoji: "🛒" },
  { name: "Other", emoji: "📦" },
]

interface AddExpensePageProps {
  onExpenseAdded: (expense: Expense) => void
}

export function AddExpensePage({ onExpenseAdded }: AddExpensePageProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (!date) {
      newErrors.date = "Please select a date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(amount),
      category,
      date,
      description,
      createdAt: new Date().toISOString(),
    }

    onExpenseAdded(expense)
    setAmount("")
    setCategory("Food")
    setDate(new Date().toISOString().split("T")[0])
    setDescription("")
    setErrors({})
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden pb-20">
      <div className="bg-gradient-to-br from-primary to-primary/90 px-6 pt-8 pb-8 rounded-b-3xl safe-area-inset-top">
        <h1 className="text-3xl font-bold text-primary-foreground">Add Expense</h1>
        <p className="text-primary-foreground/70 text-sm font-medium mt-1">Track your spending</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-lg h-12 bg-secondary border-border focus:ring-2 focus:ring-primary rounded-xl"
              />
            </div>
            {errors.amount && <p className="text-destructive text-xs font-medium">{errors.amount}</p>}
          </div>

          {/* Category Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.name}
                  type="button"
                  variant={category === cat.name ? "default" : "outline"}
                  onClick={() => setCategory(cat.name)}
                  className="h-12 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 bg-secondary border-border focus:ring-2 focus:ring-primary rounded-xl"
            />
            {errors.date && <p className="text-destructive text-xs font-medium">{errors.date}</p>}
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              type="text"
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 bg-secondary border-border focus:ring-2 focus:ring-primary rounded-xl"
            />
          </div>
        </div>

        <div className="px-6 py-6 bg-background safe-area-inset-bottom">
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors text-base"
          >
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  )
}
