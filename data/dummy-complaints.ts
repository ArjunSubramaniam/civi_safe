export interface Complaint {
  id: string
  title: string
  category: "safety" | "infrastructure" | "harassment" | "others"
  description: string
  status: "pending" | "in-review" | "resolved"
  date: string
  submittedBy: string
  hasFile?: boolean
  comments?: string[]
}

export const dummyComplaints: Complaint[] = [
  {
    id: "CMP-001",
    title: "Broken lighting in parking area",
    category: "safety",
    description:
      "The lighting in the main parking area has been broken for over a week. This creates safety concerns for students and staff during evening hours.",
    status: "pending",
    date: "2024-01-15",
    submittedBy: "user@example.com",
    hasFile: true,
    comments: [],
  },
  {
    id: "CMP-002",
    title: "Air conditioning not working in Library",
    category: "infrastructure",
    description:
      "The air conditioning system in the main library has been malfunctioning for the past three days. The temperature is uncomfortably high.",
    status: "in-review",
    date: "2024-01-14",
    submittedBy: "student@college.edu",
    comments: ["Maintenance team has been notified", "Scheduled for repair on Jan 18"],
  },
  {
    id: "CMP-003",
    title: "Inappropriate behavior in cafeteria",
    category: "harassment",
    description:
      "There have been multiple instances of inappropriate comments and behavior by certain individuals in the cafeteria during lunch hours.",
    status: "resolved",
    date: "2024-01-10",
    submittedBy: "anonymous@system.com",
    comments: ["Investigation completed", "Appropriate action taken", "Additional monitoring implemented"],
  },
  {
    id: "CMP-004",
    title: "WiFi connectivity issues in dormitory",
    category: "infrastructure",
    description:
      "Students in Block A dormitory are experiencing frequent WiFi disconnections and slow internet speeds, affecting their studies.",
    status: "in-review",
    date: "2024-01-12",
    submittedBy: "resident@college.edu",
    hasFile: false,
    comments: ["IT team investigating the issue"],
  },
  {
    id: "CMP-005",
    title: "Suggestion for better recycling system",
    category: "others",
    description:
      "I would like to suggest implementing a more comprehensive recycling system across the campus to promote environmental sustainability.",
    status: "pending",
    date: "2024-01-16",
    submittedBy: "eco.student@college.edu",
    comments: [],
  },
]
