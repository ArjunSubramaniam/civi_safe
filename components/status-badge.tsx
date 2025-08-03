import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "Pending" | "In Review" | "Resolved"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "In Review":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return <Badge className={getStatusColor(status)}>{status}</Badge>
}
