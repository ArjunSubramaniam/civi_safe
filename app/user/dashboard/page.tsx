"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ComplaintCard } from "@/components/complaint-card"
import { getCurrentUser } from "@/utils/auth"
import type { Complaint } from "@/data/dummy-complaints"
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function UserDashboard() {
  const [user, setUser] = useState(getCurrentUser())
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "user") {
      router.push("/login")
      return
    }

    // Load user complaints from localStorage
    const savedComplaints = localStorage.getItem("user_complaints")
    if (savedComplaints) {
      setUserComplaints(JSON.parse(savedComplaints))
    }
  }, [user, router])

  const handleDeleteComplaint = (id: string) => {
    const updatedComplaints = userComplaints.filter((complaint) => complaint.id !== id)
    setUserComplaints(updatedComplaints)
    localStorage.setItem("user_complaints", JSON.stringify(updatedComplaints))
  }

  if (!user) {
    return null
  }

  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter((c) => c.status === "Pending").length,
    inReview: userComplaints.filter((c) => c.status === "In Review").length,
    resolved: userComplaints.filter((c) => c.status === "Resolved").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.email.split("@")[0]}!</h1>
          <p className="text-gray-600">Manage your complaints and track their resolution status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link href="/user/submit">
            <Button size="lg" className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Submit New Complaint</span>
            </Button>
          </Link>
        </div>

        {/* Complaints List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Complaints</h2>

          {userComplaints.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any complaints. Click the button above to get started.
                </p>
                <Link href="/user/submit">
                  <Button>Submit Your First Complaint</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onDelete={handleDeleteComplaint}
                  showDeleteButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
