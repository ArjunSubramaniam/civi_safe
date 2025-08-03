"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Clock, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import ComplaintCard from "@/components/complaint-card"
import { getUserRole, getUserEmail } from "@/utils/auth"
import { toast } from "react-toastify"
import type { Complaint } from "@/data/dummy-complaints"

export default function UserDashboard() {
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const router = useRouter()

  useEffect(() => {
    const role = getUserRole()
    const email = getUserEmail()

    if (!role || role !== "user") {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserEmail(email)

    // Load user's complaints from localStorage
    const savedComplaints = localStorage.getItem("userComplaints")
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints))
    }
  }, [router])

  const handleDeleteComplaint = (complaintId: string) => {
    if (window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
      const updatedComplaints = complaints.filter((complaint) => complaint.id !== complaintId)
      setComplaints(updatedComplaints)
      localStorage.setItem("userComplaints", JSON.stringify(updatedComplaints))
      toast.success("Complaint deleted successfully")
    }
  }

  if (!userRole || !userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inReview: complaints.filter((c) => c.status === "in-review").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} userEmail={userEmail} />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Manage your complaints and track their progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inReview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/user/submit")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit New Complaint
          </button>
        </div>

        {/* Complaints List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Complaints</h2>
          {complaints.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any complaints. Click the button above to get started.
              </p>
              <button
                onClick={() => router.push("/user/submit")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Complaint
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onDelete={handleDeleteComplaint}
                  showDelete={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
