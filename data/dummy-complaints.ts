export interface Complaint {
  id: string
  title: string
  category: "Safety" | "Infrastructure" | "Harassment" | "Others"
  description: string
  status: "Pending" | "In Review" | "Resolved"
  submittedBy: string
  submittedAt: string
  comments?: string[]
  fileName?: string
}

export const dummyComplaints: Complaint[] = [
  {
    id: "1",
    title: "Broken streetlight in parking lot",
    category: "Safety",
    description:
      "The streetlight near the main entrance has been flickering for weeks and now completely stopped working. This creates a safety hazard for students walking to their cars at night.",
    status: "In Review",
    submittedBy: "student@college.edu",
    submittedAt: "2024-01-15T10:30:00Z",
    comments: ["Investigation started", "Maintenance team notified"],
  },
  {
    id: "2",
    title: "Water leak in Building A restroom",
    category: "Infrastructure",
    description:
      "There is a significant water leak in the second floor restroom of Building A. The floor is constantly wet and slippery.",
    status: "Resolved",
    submittedBy: "faculty@college.edu",
    submittedAt: "2024-01-10T14:20:00Z",
    comments: ["Plumber contacted", "Leak fixed on 2024-01-12"],
  },
  {
    id: "3",
    title: "Inappropriate behavior in cafeteria",
    category: "Harassment",
    description:
      "A staff member has been making inappropriate comments to students during lunch hours. Multiple students have reported feeling uncomfortable.",
    status: "Pending",
    submittedBy: "anonymous",
    submittedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "4",
    title: "Parking space allocation issue",
    category: "Others",
    description:
      "The new parking allocation system is not working properly. Many faculty members are unable to find designated parking spots.",
    status: "In Review",
    submittedBy: "admin@college.edu",
    submittedAt: "2024-01-18T16:45:00Z",
    comments: ["Reviewing parking policy"],
  },
  {
    id: "5",
    title: "Elevator malfunction in Library",
    category: "Infrastructure",
    description:
      "The elevator in the main library building has been making strange noises and occasionally stops between floors.",
    status: "Pending",
    submittedBy: "librarian@college.edu",
    submittedAt: "2024-01-22T11:00:00Z",
  },
]
