"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import type { Complaint } from "@/data/dummy-complaints"
import { Trash2, Calendar, User } from "lucide-react"
import { toast } from "react-hot-toast"

interface ComplaintCardProps {
  complaint: Complaint
  onDelete?: (id: string) => void
  showDeleteButton?: boolean
}

export function ComplaintCard({ complaint, onDelete, showDeleteButton = false }: ComplaintCardProps) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      onDelete?.(complaint.id)
      toast.success("Complaint deleted successfully")
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{complaint.title}</CardTitle>
          {showDeleteButton && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={complaint.status} />
          <span className="text-sm text-gray-500 capitalize px-2 py-1 bg-gray-100 rounded">{complaint.category}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{complaint.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{complaint.submittedBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(complaint.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
        {complaint.comments && complaint.comments.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1">Latest comment:</p>
            <p className="text-xs text-gray-700 italic">{complaint.comments[complaint.comments.length - 1]}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
