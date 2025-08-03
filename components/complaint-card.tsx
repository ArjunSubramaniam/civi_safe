"use client"

import { Calendar, Tag, FileText, Trash2 } from "lucide-react"
import StatusBadge from "./status-badge"

interface ComplaintCardProps {
  complaint: {
    id: string
    title: string
    category: string
    description: string
    status: "pending" | "in-review" | "resolved"
    date: string
    hasFile?: boolean
  }
  onDelete?: (id: string) => void
  showDelete?: boolean
}

export default function ComplaintCard({ complaint, onDelete, showDelete = false }: ComplaintCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(complaint.id)}
                className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Delete complaint"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              <span className="capitalize">{complaint.category}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{complaint.date}</span>
            </div>
            {complaint.hasFile && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>File attached</span>
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">{complaint.description}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Complaint ID: {complaint.id}</p>
      </div>
    </div>
  )
}
