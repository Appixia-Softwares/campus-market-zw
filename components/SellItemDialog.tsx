"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export default function SellItemDialog() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch("/api/marketplace/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price: parseFloat(price), user_id: "demo-user" }),
    })

    const result = await res.json()
    setLoading(false)
    if (!res.ok) {
      alert("Error: " + result.error)
    } else {
      alert("Item listed successfully!")
      setTitle("")
      setDescription("")
      setPrice("")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="animate-slide-up">
          <Plus className="h-4 w-4 mr-2" />
          Sell an Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell an Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <Input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
