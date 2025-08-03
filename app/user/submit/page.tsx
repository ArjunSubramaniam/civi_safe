"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/utils/auth"
import type { Complaint } from "@/data/dummy-complaints"
import { ArrowLeft, Upload, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function SubmitComplaint() {
  const [user, setUser] = useState(getCurrentUser())
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<"Safety" | "Infrastructure" | "Harassment" | "Others">("Safety")
  const [description, setDescription] = useState("")
  const [fileName, setFileName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "user") {
      router.push("/login")
    }
  }, [user, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      toast.success("File selected successfully")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      title,
      category,
      description,
      status: "Pending",
      submittedBy: user.email,
      submittedAt: new Date().toISOString(),
      fileName: fileName || undefined,
    }

    // Save to localStorage
    const existingComplaints = JSON.parse(localStorage.getItem("user_complaints") || "[]")
    const updatedComplaints = [...existingComplaints, newComplaint]
    localStorage.setItem("user_complaints", JSON.stringify(updatedComplaints))

    toast.success("Complaint submitted successfully!")
    router.push("/user/dashboard")
    setIsSubmitting(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/user/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Submit New Complaint</CardTitle>
              <CardDescription>
                Provide detailed information about your complaint to help us resolve it quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Harassment">Harassment</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the complaint..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Attach File (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file")?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Choose File</span>
                    </Button>
                    {fileName && <span className="text-sm text-gray-600">Selected: {fileName}</span>}
                  </div>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)</p>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting} className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Complaint"}</span>
                  </Button>
                  <Link href="/user/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
