"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"
import { StatusBadge } from "@/components/status-badge"
import { getCurrentUser } from "@/utils/auth"
import { dummyComplaints, type Complaint } from "@/data/dummy-complaints"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  MessageSquare,
  Trash2,
  Filter,
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function AdminDashboard() {
  const [user, setUser] = useState(getCurrentUser())
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newComment, setNewComment] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
      return
    }

    // Load user complaints from localStorage
    const savedUserComplaints = JSON.parse(localStorage.getItem("user_complaints") || "[]")
    setUserComplaints(savedUserComplaints)

    // Combine dummy complaints with user complaints
    const allComplaints = [...dummyComplaints, ...savedUserComplaints]
    setComplaints(allComplaints)
    setFilteredComplaints(allComplaints)
  }, [user, router])

  useEffect(() => {
    // Filter complaints based on status and category
    let filtered = complaints

    if (statusFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((complaint) => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, statusFilter, categoryFilter])

  const handleStatusChange = (complaintId: string, newStatus: "Pending" | "In Review" | "Resolved") => {
    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === complaintId) {
        return { ...complaint, status: newStatus }
      }
      return complaint
    })

    setComplaints(updatedComplaints)

    // Update localStorage for user complaints
    const updatedUserComplaints = userComplaints.map((complaint) => {
      if (complaint.id === complaintId) {
        return { ...complaint, status: newStatus }
      }
      return complaint
    })
    setUserComplaints(updatedUserComplaints)
    localStorage.setItem("user_complaints", JSON.stringify(updatedUserComplaints))

    toast.success(`Complaint status updated to ${newStatus}`)
  }

  const handleAddComment = (complaintId: string) => {
    if (!newComment.trim()) return

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === complaintId) {
        const updatedComments = [...(complaint.comments || []), newComment]
        return { ...complaint, comments: updatedComments }
      }
      return complaint
    })

    setComplaints(updatedComplaints)

    // Update localStorage for user complaints
    const updatedUserComplaints = userComplaints.map((complaint) => {
      if (complaint.id === complaintId) {
        const updatedComments = [...(complaint.comments || []), newComment]
        return { ...complaint, comments: updatedComments }
      }
      return complaint
    })
    setUserComplaints(updatedUserComplaints)
    localStorage.setItem("user_complaints", JSON.stringify(updatedUserComplaints))

    setNewComment("")
    toast.success("Comment added successfully")
  }

  const handleDeleteComplaint = (complaintId: string) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      // Remove from complaints list
      const updatedComplaints = complaints.filter((complaint) => complaint.id !== complaintId)
      setComplaints(updatedComplaints)

      // Update localStorage for user complaints (only delete if it's a user complaint)
      const updatedUserComplaints = userComplaints.filter((complaint) => complaint.id !== complaintId)
      setUserComplaints(updatedUserComplaints)
      localStorage.setItem("user_complaints", JSON.stringify(updatedUserComplaints))

      toast.success("Complaint deleted successfully")
    }
  }

  if (!user) {
    return null
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inReview: complaints.filter((c) => c.status === "In Review").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  }

  const categoryStats = {
    safety: complaints.filter((c) => c.category === "Safety").length,
    infrastructure: complaints.filter((c) => c.category === "Infrastructure").length,
    harassment: complaints.filter((c) => c.category === "Harassment").length,
    others: complaints.filter((c) => c.category === "Others").length,
  }

  const recentComplaints = complaints
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and track all complaints across your organization</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Review</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
                  <p className="text-xs text-muted-foreground">Being processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Latest submissions requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{complaint.title}</p>
                          <p className="text-xs text-gray-500">{complaint.submittedBy}</p>
                        </div>
                        <StatusBadge status={complaint.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Breakdown by complaint type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Safety</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(categoryStats.safety / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{categoryStats.safety}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Infrastructure</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(categoryStats.infrastructure / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{categoryStats.infrastructure}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Harassment</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(categoryStats.harassment / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{categoryStats.harassment}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Others</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(categoryStats.others / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{categoryStats.others}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter Complaints</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Harassment">Harassment</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complaints Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Complaints ({filteredComplaints.length})</CardTitle>
                <CardDescription>Manage and track complaint resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={complaint.title}>
                              {complaint.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{complaint.category}</span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status} />
                          </TableCell>
                          <TableCell className="text-sm">{complaint.submittedBy}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(complaint.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={complaint.status}
                                onValueChange={(value: any) => handleStatusChange(complaint.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Review">In Review</SelectItem>
                                  <SelectItem value="Resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{complaint.title}</DialogTitle>
                                    <DialogDescription>
                                      Submitted by {complaint.submittedBy} on{" "}
                                      {new Date(complaint.submittedAt).toLocaleDateString()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Description</h4>
                                      <p className="text-sm text-gray-600">{complaint.description}</p>
                                    </div>

                                    {complaint.comments && complaint.comments.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Comments</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                          {complaint.comments.map((comment, index) => (
                                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                              {comment}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div>
                                      <h4 className="font-semibold mb-2">Add Comment</h4>
                                      <div className="flex space-x-2">
                                        <Textarea
                                          placeholder="Add a comment..."
                                          value={newComment}
                                          onChange={(e) => setNewComment(e.target.value)}
                                          className="flex-1"
                                        />
                                        <Button
                                          onClick={() => handleAddComment(complaint.id)}
                                          disabled={!newComment.trim()}
                                        >
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComplaint(complaint.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Resolution Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {stats.resolved} out of {stats.total} complaints resolved
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Response Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-blue-600">2.4 days</div>
                    <p className="text-sm text-gray-600">Average time to first response</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target: 24 hours</span>
                        <span className="text-green-600">✓ Meeting target</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Monthly Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-purple-600">+12%</div>
                    <p className="text-sm text-gray-600">Increase in complaints this month</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This month</span>
                        <span className="font-medium">{stats.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last month</span>
                        <span className="text-gray-500">{Math.round(stats.total * 0.88)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfaction Rate</span>
                      <span className="text-lg font-bold text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Contact Resolution</span>
                      <span className="text-lg font-bold text-blue-600">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Escalation Rate</span>
                      <span className="text-lg font-bold text-orange-600">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
