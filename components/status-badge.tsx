interface StatusBadgeProps {
  status: "pending" | "in-review" | "resolved"
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "in-review":
        return {
          label: "In Review",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "resolved":
        return {
          label: "Resolved",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      default:
        return {
          label: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  )
}
