"use client"

import { useRouter } from "next/navigation"
import { Shield, LogOut, User, Settings } from "lucide-react"
import toast from "react-hot-toast"

interface NavbarProps {
  userRole: "user" | "admin"
  userEmail: string
}

export default function Navbar({ userRole, userEmail }: NavbarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    toast.success("Logged out successfully")
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CiviSafe</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${userRole === "admin" ? "bg-red-100" : "bg-blue-100"}`}>
                {userRole === "admin" ? (
                  <Settings className="h-4 w-4 text-red-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 capitalize">{userRole}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
