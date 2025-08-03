"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  MessageSquare,
  Trash2,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "@/components/navbar"
import StatusBadge from "@/components/status-badge"
import { getUserRole, getUserEmail } from "@/utils/auth"
import { dummyComplaints, type Complaint } from "@/data/dummy-complaints"

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = getUserRole()
    const email = getUserEmail()

    if (!role || role !== "admin") {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserEmail(email)

    // Set active tab from URL params
    const tab = searchParams.get("tab") || "overview"
    setActiveTab(tab)

    // Load complaints (combine dummy data with user submissions)
    const userComplaints = JSON.parse(localStorage.getItem("userComplaints") || "[]")
    const allComplaints = [...dummyComplaints, ...userComplaints]
    setComplaints(allComplaints)
    setFilteredComplaints(allComplaints)
  }, [router, searchParams])

  useEffect(() => {
    let filtered = complaints

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, statusFilter, categoryFilter])

  const handleStatusChange = (complaintId: string, newStatus: "pending" | "in-review" | "resolved") => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint,
    )

    setComplaints(updatedComplaints)

    // Update localStorage for user complaints
    const userComplaints = updatedComplaints.filter((c) => !dummyComplaints.find((dc) => dc.id === c.id))
    localStorage.setItem("userComplaints", JSON.stringify(userComplaints))

    toast.success(`Complaint ${complaintId} status updated to ${newStatus}`)
  }

  const addComment = (complaintId: string) => {
    const comment = prompt("Add a comment:")
    if (comment) {
      const updatedComplaints = complaints.map((complaint) =>
        complaint.id === complaintId ? { ...complaint, comments: [...(complaint.comments || []), comment] } : complaint,
      )

      setComplaints(updatedComplaints)
      toast.success("Comment added successfully")
    }
  }

  const handleDeleteComplaint = (complaintId: string) => {
    if (window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
      const updatedComplaints = complaints.filter((complaint) => complaint.id !== complaintId)
      setComplaints(updatedComplaints)

      // Update localStorage for user complaints
      const userComplaints = updatedComplaints.filter((c) => !dummyComplaints.find((dc) => dc.id === c.id))
      localStorage.setItem("userComplaints", JSON.stringify(userComplaints))

      toast.success(`Complaint ${complaintId} deleted successfully`)
    }
  }

  const navigateToTab = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin/dashboard?tab=${tab}`)
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

  const categoryStats = {
    safety: complaints.filter((c) => c.category === "safety").length,
    infrastructure: complaints.filter((c) => c.category === "infrastructure").length,
    harassment: complaints.filter((c) => c.category === "harassment").length,
    others: complaints.filter((c) => c.category === "others").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} userEmail={userEmail} />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Comprehensive complaint management and analytics dashboard.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => navigateToTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => navigateToTab("complaints")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "complaints"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Complaints
                </div>
              </button>
              <button
                onClick={() => navigateToTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                <div className="space-y-4">
                  {complaints.slice(0, 5).map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{complaint.title}</p>
                        <p className="text-sm text-gray-500">
                          {complaint.category} • {complaint.date}
                        </p>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Safety</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${stats.total > 0 ? (categoryStats.safety / stats.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{categoryStats.safety}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Infrastructure</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${stats.total > 0 ? (categoryStats.infrastructure / stats.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{categoryStats.infrastructure}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Harassment</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${stats.total > 0 ? (categoryStats.harassment / stats.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{categoryStats.harassment}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Others</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${stats.total > 0 ? (categoryStats.others / stats.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{categoryStats.others}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="safety">Safety</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="harassment">Harassment</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Complaints ({filteredComplaints.length})</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredComplaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{complaint.title}</p>
                            <p className="text-gray-500 text-xs truncate">{complaint.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <select
                              value={complaint.status}
                              onChange={(e) => handleStatusChange(complaint.id, e.target.value as any)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-review">In Review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <button
                              onClick={() => addComment(complaint.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="Add Comment"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComplaint(complaint.id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete Complaint"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredComplaints.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                  <p className="text-gray-600">No complaints match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {stats.resolved} out of {stats.total} complaints resolved
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Response Time</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">2.3</div>
                  <div className="text-gray-600 mb-4">Days</div>
                  <div className="text-sm text-gray-500">15% improvement from last month</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                <p>Detailed analytics charts would be displayed here in a production environment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
