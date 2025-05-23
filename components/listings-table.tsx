"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"

export function ListingsTable() {
  const listings = [
    {
      id: 1,
      title: "2 Bedroom Apartment near Campus",
      location: "123 University Ave",
      price: "$650/month",
      status: "Active",
      rooms: 2,
      created: "Apr 10, 2025",
    },
    {
      id: 2,
      title: "Studio Apartment with Utilities",
      location: "456 College St",
      price: "$450/month",
      status: "Active",
      rooms: 1,
      created: "Apr 15, 2025",
    },
    {
      id: 3,
      title: "Shared Room in Student House",
      location: "789 Dorm Lane",
      price: "$350/month",
      status: "Pending",
      rooms: 1,
      created: "Apr 20, 2025",
    },
    {
      id: 4,
      title: "Private Room with Bathroom",
      location: "101 Campus Drive",
      price: "$500/month",
      status: "Active",
      rooms: 1,
      created: "Apr 25, 2025",
    },
    {
      id: 5,
      title: "3 Bedroom House for Students",
      location: "202 Academic Blvd",
      price: "$900/month",
      status: "Inactive",
      rooms: 3,
      created: "Apr 30, 2025",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rooms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell>{listing.location}</TableCell>
                <TableCell>{listing.price}</TableCell>
                <TableCell>{listing.rooms}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      listing.status === "Active" ? "default" : listing.status === "Pending" ? "outline" : "secondary"
                    }
                  >
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell>{listing.created}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
