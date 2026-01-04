"use client"

import { useState, useEffect, useCallback } from "react"
import type { Expense } from "@/types/expense"

const DB_NAME = "ExpenseTrackerDB"
const STORE_NAME = "expenses"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [db, setDb] = useState<IDBDatabase | null>(null)

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
            store.createIndex("date", "date", { unique: false })
          }
        }
      })
    }

    initDB()
      .then((database) => {
        setDb(database)
        loadExpenses(database)
      })
      .catch(console.error)

    return () => {
      // Cleanup
    }
  }, [])

  const loadExpenses = useCallback((database: IDBDatabase) => {
    const transaction = database.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      setExpenses(request.result as Expense[])
    }
  }, [])

  const addExpense = useCallback(
    (expense: Expense) => {
      if (!db) return

      const transaction = db.transaction(STORE_NAME, "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(expense)

      request.onsuccess = () => {
        setExpenses((prev) => [...prev, expense])
      }
      request.onerror = () => console.error("Failed to add expense")
    },
    [db],
  )

  const deleteExpense = useCallback(
    (id: string) => {
      if (!db) return

      const transaction = db.transaction(STORE_NAME, "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id))
      }
      request.onerror = () => console.error("Failed to delete expense")
    },
    [db],
  )

  return { expenses, addExpense, deleteExpense }
}
