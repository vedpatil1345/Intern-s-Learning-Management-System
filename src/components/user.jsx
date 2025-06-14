"use client"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  FileText,
  Award,
  Calendar,
  LogOut,
  ChevronDown,
  ExternalLink,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"

const UserMenu = () => {
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, isLoading: profileLoading, error: profileError } = useProfile(user)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Update error state if profile fetch fails
  useEffect(() => {
    if (profileError) {
      setError(profileError)
    }
  }, [profileError])

  const handleToggle = () => {
    if (!user) {
      router.push("/sign-in")
    } else {
      setIsOpen((prev) => !prev)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
      router.push("/sign-in")
      router.refresh()
    } catch (err) {
      setError("Failed to sign out")
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse"></div>
      </div>
    )
  }

  const displayName = profile?.first_name || user?.email || "User"
  const fullName =
    profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : displayName
  const initial = displayName.charAt(0).toUpperCase()

  // Helper function to format application status with icons
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Clock,
        }
      case "approved":
        return {
          text: "Approved",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
        }
      case "rejected":
        return {
          text: "Rejected",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
        }
      case "completed":
        return {
          text: "Completed",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: Award,
        }
      default:
        return {
          text: status || "Unknown",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: AlertCircle,
        }
    }
  }

  const statusDisplay = getStatusDisplay(profile?.application_status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="user-menu-button"
        onClick={handleToggle}
        className="group w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-3 focus:ring-blue-300 transition-all duration-200 transform hover:shadow-lg"
        title={fullName}
        aria-label={`User menu for ${fullName}`}
        aria-expanded={isOpen}
      >
        <span className="group-hover:scale-110 transition-transform duration-200">{initial}</span>
        <ChevronDown
          className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white text-gray-600 rounded-full p-0.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && user && (
        <div
          className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-top-2"
          role="menu"
          aria-labelledby="user-menu-button"
        >
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold truncate">{fullName}</h3>
                <p className="text-blue-100 text-sm truncate flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {profile?.email || user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusDisplay.bgColor} ${statusDisplay.color} ${statusDisplay.borderColor} border`}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusDisplay.text}
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-3 text-gray-400" />
                <span className="font-medium">Type:</span>
                <span className="ml-2 capitalize">{profile?.type || "Student"}</span>
              </div>

              <div className="flex items-center text-sm text-gray-700">
                <FileText className="w-4 h-4 mr-3 text-gray-400" />
                <span className="font-medium">Internship:</span>
                <span className="ml-2">{profile?.internship_title || "Not specified"}</span>
              </div>

              {profile?.created_at && (
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="font-medium">Joined:</span>
                  <span className="ml-2">
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Links Section */}
            {(profile?.resume || (profile?.cert_issued && profile?.certificate_url)) && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Documents</h4>

                {profile?.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 text-sm text-blue-700 group"
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </div>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                )}

                {profile?.cert_issued && profile?.certificate_url && (
                  <a
                    href={profile.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 text-sm text-green-700 group"
                  >
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Download Certificate
                    </div>
                    <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-100 bg-gray-50">
            <Button
              onClick={() => {
                setIsOpen(false)
                router.push("/profile")
              }}
              className="w-full bg-transparent hover:bg-white text-gray-700 hover:text-blue-600 font-medium p-4 text-left transition-all duration-200 flex items-center justify-between group border-b border-gray-200"
              role="menuitem"
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3" />
                View Profile
              </div>
              <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>

            <Button
              onClick={handleSignOut}
              className="w-full bg-transparent hover:bg-red-50 text-gray-700 hover:text-red-600 font-medium p-4 text-left transition-all duration-200 flex items-center group"
              role="menuitem"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
