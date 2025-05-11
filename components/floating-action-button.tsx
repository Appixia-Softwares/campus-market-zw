"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Package, Building } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  className?: string
}

export default function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={toggleOpen}
            />

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-16 right-0 z-50 flex flex-col gap-3 items-end"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-sm font-medium bg-background rounded-md shadow">List an Item</span>
                <Button size="icon" variant="secondary" asChild>
                  <Link href="/marketplace/new">
                    <Package className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-sm font-medium bg-background rounded-md shadow">List a Room</span>
                <Button size="icon" variant="secondary" asChild>
                  <Link href="/accommodation/new">
                    <Building className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={toggleOpen}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  )
}
