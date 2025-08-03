"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import Navbar from "@/components/navbar"
import { getUserRole, getUserEmail } from "@/utils/auth"
import type { Complaint } from "@/data/dummy-complaints"

export default function SubmitComplaint() {
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    hasFile: false,
  })
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
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create new complaint
    const newComplaint: Complaint = {
      id: `CMP-${Date.now().toString().slice(-3)}`,
      title: formData.title,
      category: formData.category as any,
      description: formData.description,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      submittedBy: userEmail || "",
      hasFile: formData.hasFile,
      comments: [],
    }

    // Save to localStorage
    const existingComplaints = JSON.parse(localStorage.getItem("userComplaints") || "[]")
    const updatedComplaints = [newComplaint, ...existingComplaints]
    localStorage.setItem("userComplaints", JSON.stringify(updatedComplaints))

    toast.success("Complaint submitted successfully!")
    setIsSubmitting(false)
    router.push("/user/dashboard")
  }

  const handleFileUpload = () => {
    // Mock file upload
    setFormData((prev) => ({ ...prev, hasFile: !prev.hasFile }))
    if (!formData.hasFile) {
      toast.success("File attached successfully (mock)")
    } else {
      toast.success("File removed")
    }
  }

  if (!userRole || !userEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} userEmail={userEmail} />

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
            <p className="text-gray-600">Help us improve by reporting issues or concerns.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="safety">Safety</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="harassment">Harassment</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide detailed information about your complaint..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Attachment (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {formData.hasFile ? (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-900">document.pdf (mock file)</span>
                      </div>
                      <button type="button" onClick={handleFileUpload} className="text-red-600 hover:text-red-800">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload a file</p>
                      <button
                        type="button"
                        onClick={handleFileUpload}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Choose file (mock upload)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
