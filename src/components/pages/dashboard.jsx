"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import {
  Users,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  BarChart3,
  FileText,
  Upload,
  Plus,
  Eye,
  Download,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  ChevronRight,
  Home,
  CalendarIcon,
  FolderOpen,
  GraduationCap,
  ClipboardList,
  Library,
  PlayCircle,
  Search,
  ExternalLink,
  X,
  Menu, // Added Menu icon for mobile toggle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ComprehensiveDashboard = () => {
  const { user } = useAuth()
  const { profile, isLoading } = useProfile(user)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for sidebar visibility

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const userRole = profile?.type || "intern"

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "sessions", label: "Session Details", icon: CalendarIcon },
      { id: "attendance", label: "Attendance", icon: ClipboardList },
      { id: "materials", label: "Study Material", icon: Library },
      { id: "recordings", label: "Session Recording", icon: PlayCircle },
    ]

    const internItems = [
      ...baseItems,
      { id: "projects", label: "Project Selection", icon: FolderOpen },
      { id: "offer", label: "Offer Letter", icon: FileText },
      { id: "certificate", label: "Download Certificate", icon: GraduationCap },
    ]

    const mentorItems = [
      ...baseItems,
      { id: "projects", label: "Project Management", icon: FolderOpen },
      { id: "reports", label: "Progress Reports", icon: BarChart3 },
    ]

    const adminItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "sessions", label: "All Sessions", icon: CalendarIcon },
      { id: "attendance", label: "Attendance Reports", icon: ClipboardList },
      { id: "materials", label: "Content Management", icon: Library },
      { id: "recordings", label: "All Recordings", icon: PlayCircle },
      { id: "projects", label: "Project Oversight", icon: FolderOpen },
      { id: "certificates", label: "Certificate Management", icon: GraduationCap },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ]

    switch (userRole) {
      case "admin":
        return adminItems
      case "mentor":
        return mentorItems
      default:
        return internItems
    }
  }

  // Dashboard Overview Component
  const DashboardOverview = () => {
    if (userRole === "admin") {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">Manage your internship program and monitor overall performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Interns</p>
                    <p className="text-3xl font-bold text-blue-900">156</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Active Sessions</p>
                    <p className="text-3xl font-bold text-green-900">24</p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Certificates Issued</p>
                    <p className="text-3xl font-bold text-purple-900">89</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Avg Attendance</p>
                    <p className="text-3xl font-bold text-orange-900">92%</p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (userRole === "mentor") {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
            <p className="text-green-100">Guide your interns and track their progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">My Interns</p>
                    <p className="text-3xl font-bold text-green-900">8</p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Sessions This Week</p>
                    <p className="text-3xl font-bold text-blue-900">12</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Avg Progress</p>
                    <p className="text-3xl font-bold text-purple-900">78%</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Completed Projects</p>
                    <p className="text-3xl font-bold text-orange-900">15</p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-xl">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    // Intern Dashboard
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.first_name || "Intern"}!</h1>
          <p className="text-purple-100">Continue your learning journey and track your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Overall Progress</p>
                  <p className="text-3xl font-bold text-purple-900">65%</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Sessions Attended</p>
                  <p className="text-3xl font-bold text-blue-900">18/20</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Projects Completed</p>
                  <p className="text-3xl font-bold text-green-900">3/5</p>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Attendance Rate</p>
                  <p className="text-3xl font-bold text-orange-900">90%</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-xl">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Session Details Component
  const SessionDetails = () => {
    const [sessions] = useState([
      {
        id: 1,
        title: "React Fundamentals - Components & Props",
        date: "2024-01-15",
        time: "2:00 PM - 4:00 PM",
        mentor: "John Smith",
        status: "completed",
        attendance: "present",
        recording: true,
      },
      {
        id: 2,
        title: "State Management with Redux",
        date: "2024-01-17",
        time: "10:00 AM - 12:00 PM",
        mentor: "Sarah Johnson",
        status: "upcoming",
        attendance: "scheduled",
        recording: false,
      },
      {
        id: 3,
        title: "API Integration & Async Operations",
        date: "2024-01-20",
        time: "3:00 PM - 5:00 PM",
        mentor: "Mike Davis",
        status: "upcoming",
        attendance: "scheduled",
        recording: false,
      },
    ])

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {userRole === "admin" || userRole === "mentor" ? "Schedule Session" : "Request Session"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-gray-600">Mentor: {session.mentor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : session.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {session.status}
                    </span>
                    {session.recording && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveSection("recordings")}
                      >
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Recording
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {session.date}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {session.time}
                  </div>
                  <div className="flex items-center">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    <span
                      className={`font-medium ${
                        session.attendance === "present"
                          ? "text-green-600"
                          : session.attendance === "absent"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {session.attendance}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Project Selection Component
  const ProjectSelection = () => {
    const [projects] = useState([
      {
        id: 1,
        title: "E-commerce Website",
        description: "Build a full-stack e-commerce platform with React, Node.js, and MongoDB",
        difficulty: "Advanced",
        duration: "6 weeks",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        status: "available",
        mentor: "John Smith",
      },
      {
        id: 2,
        title: "Mobile Task Manager",
        description: "Create a cross-platform mobile app using Flutter for task management",
        difficulty: "Intermediate",
        duration: "4 weeks",
        technologies: ["Flutter", "Dart", "Firebase"],
        status: "selected",
        mentor: "Sarah Johnson",
      },
      {
        id: 3,
        title: "IoT Weather Station",
        description: "Develop an IoT-based weather monitoring system with real-time data",
        difficulty: "Advanced",
        duration: "8 weeks",
        technologies: ["Arduino", "Python", "MQTT", "React"],
        status: "available",
        mentor: "Mike Davis",
      },
    ])

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {userRole === "admin" ? "Project Management" : "Project Selection"}
          </h2>
          {(userRole === "admin" || userRole === "mentor") && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">Mentor: {project.mentor}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "selected"
                        ? "bg-green-100 text-green-700"
                        : project.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>
                    <span
                      className={`ml-2 ${
                        project.difficulty === "Advanced"
                          ? "text-red-600"
                          : project.difficulty === "Intermediate"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {project.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{project.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-medium text-gray-700 text-sm">Technologies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {project.status === "available" && userRole === "intern" && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Select Project</Button>
                  )}
                  {project.status === "selected" && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      View Progress
                    </Button>
                  )}
                  <Button variant="outline" className="px-4">
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Offer Letter Component
  const OfferLetter = () => {
    const [offerStatus] = useState({
      available: true,
      issued: true,
      company: "IOTechz Solutions",
      position: "Full Stack Developer Intern",
      startDate: "2024-02-01",
      duration: "6 months",
      stipend: "$800/month",
    })

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Offer Letter</h2>

        {offerStatus.available ? (
          <Card className="max-w-4xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h3>
                <p className="text-gray-600">Your internship offer letter is ready</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900">{offerStatus.company}</h4>
                  <p className="text-gray-600">Internship Offer Letter</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500">Position</p>
                      <p className="text-lg font-semibold text-gray-900">{offerStatus.position}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p className="text-lg font-semibold text-gray-900">{offerStatus.startDate}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{offerStatus.duration}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-500">Stipend</p>
                      <p className="text-lg font-semibold text-gray-900">{offerStatus.stipend}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Terms & Conditions</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Maintain 90% attendance throughout the internship period</li>
                      <li>• Complete all assigned projects and assessments</li>
                      <li>• Participate actively in mentoring sessions</li>
                      <li>• Adhere to company policies and code of conduct</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                    <Download className="w-4 h-4 mr-2" />
                    Download Offer Letter
                  </Button>
                  <Button variant="outline" className="px-8">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Offer Letter Available</h3>
              <p className="text-gray-600 mb-6">Complete your internship requirements to receive your offer letter</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Requirements</Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Certificate Download Component
  const CertificateDownload = () => {
    const [certificateStatus] = useState({
      available: true,
      issued: true,
      issueDate: "2024-01-15",
      certificateId: "IOT-2024-001",
      program: "Full Stack Development",
      grade: "A+",
    })

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Download Certificate</h2>

        {certificateStatus.available ? (
          <Card className="max-w-4xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                <p className="text-gray-600">Congratulations on completing your internship!</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Award className="w-12 h-12 text-yellow-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">IOTechz Solutions</h4>
                  <p className="text-lg text-gray-700">Certificate of Completion</p>
                </div>

                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-2">This is to certify that</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-gray-600 mb-4">has successfully completed the</p>
                  <p className="text-xl font-semibold text-blue-600 mb-4">{certificateStatus.program} Internship</p>
                  <p className="text-gray-600">
                    with grade: <span className="font-bold text-green-600">{certificateStatus.grade}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Certificate ID</p>
                    <p className="font-semibold text-gray-900">{certificateStatus.certificateId}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Issue Date</p>
                    <p className="font-semibold text-gray-900">{certificateStatus.issueDate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Verification</p>
                    <p className="font-semibold text-green-600">Verified ✓</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" className="px-8">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Verify Online
                  </Button>
                  <Button variant="outline" className="px-8">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificate Not Available</h3>
              <p className="text-gray-600 mb-6">Complete all internship requirements to earn your certificate</p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Complete all assigned projects</li>
                  <li>✓ Maintain 90% attendance</li>
                  <li>⏳ Pass final assessment</li>
                  <li>⏳ Submit final project</li>
                </ul>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Progress</Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Attendance Component
  const AttendanceView = () => {
    const [attendanceData] = useState([
      { date: "2024-01-15", session: "React Fundamentals", status: "present", duration: "2 hours" },
      { date: "2024-01-17", session: "State Management", status: "present", duration: "2 hours" },
      { date: "2024-01-19", session: "API Integration", status: "absent", duration: "2 hours" },
      { date: "2024-01-22", session: "Testing & Debugging", status: "present", duration: "2 hours" },
      { date: "2024-01-24", session: "Deployment", status: "present", duration: "2 hours" },
    ])

    const attendanceRate = Math.round(
      (attendanceData.filter((a) => a.status === "present").length / attendanceData.length) * 100,
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
              {attendanceRate}% Attendance Rate
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Present</p>
                  <p className="text-3xl font-bold text-green-900">
                    {attendanceData.filter((a) => a.status === "present").length}
                  </p>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Absent</p>
                  <p className="text-3xl font-bold text-red-900">
                    {attendanceData.filter((a) => a.status === "absent").length}
                  </p>
                </div>
                <div className="bg-red-500 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-900">{attendanceData.length}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
              Attendance Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${record.status === "present" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div>
                      <p className="font-semibold text-gray-900">{record.session}</p>
                      <p className="text-sm text-gray-600">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{record.duration}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Study Materials Component
  const StudyMaterials = () => {
    const [materials] = useState([
      {
        id: 1,
        title: "React Fundamentals Guide",
        type: "PDF",
        size: "2.5 MB",
        category: "Frontend",
        uploadDate: "2024-01-10",
        downloads: 45,
      },
      {
        id: 2,
        title: "JavaScript ES6+ Features",
        type: "PDF",
        size: "1.8 MB",
        category: "Programming",
        uploadDate: "2024-01-08",
        downloads: 67,
      },
      {
        id: 3,
        title: "Node.js Best Practices",
        type: "DOCX",
        size: "3.2 MB",
        category: "Backend",
        uploadDate: "2024-01-12",
        downloads: 32,
      },
      {
        id: 4,
        title: "Database Design Principles",
        type: "PDF",
        size: "4.1 MB",
        category: "Database",
        uploadDate: "2024-01-05",
        downloads: 28,
      },
    ])

    const [selectedCategory, setSelectedCategory] = useState("all")
    const categories = ["all", "Frontend", "Backend", "Programming", "Database"]

    const filteredMaterials =
      selectedCategory === "all" ? materials : materials.filter((material) => material.category === selectedCategory)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {(userRole === "admin" || userRole === "mentor") && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Categories" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{material.title}</h3>
                      <p className="text-sm text-gray-600">
                        {material.type} • {material.size}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {material.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Uploaded: {material.uploadDate}</span>
                  <span>{material.downloads} downloads</span>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="px-4">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Session Recordings Component
  const SessionRecordings = () => {
    const [recordings] = useState([
      {
        id: 1,
        title: "React Fundamentals - Components & Props",
        date: "2024-01-15",
        duration: "2:15:30",
        mentor: "John Smith",
        views: 45,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 2,
        title: "State Management with Redux",
        date: "2024-01-17",
        duration: "1:45:20",
        mentor: "Sarah Johnson",
        views: 32,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 3,
        title: "API Integration & Async Operations",
        date: "2024-01-20",
        duration: "2:30:15",
        mentor: "Mike Davis",
        views: 28,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
    ])

    const [selectedRecording, setSelectedRecording] = useState(null)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Session Recordings</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search recordings..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {selectedRecording ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedRecording.title}</h3>
                <Button variant="outline" onClick={() => setSelectedRecording(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-xl mb-4 relative aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">{selectedRecording.title}</p>
                    <p className="text-gray-300">Duration: {selectedRecording.duration}</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">0:00 / {selectedRecording.duration}</span>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Mentor:</span>
                  <span className="ml-2 text-gray-600">{selectedRecording.mentor}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2 text-gray-600">{selectedRecording.date}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Views:</span>
                  <span className="ml-2 text-gray-600">{selectedRecording.views}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <Card key={recording.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={recording.thumbnail || "/placeholder.svg"}
                      alt={recording.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => setSelectedRecording(recording)}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {recording.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{recording.mentor}</span>
                      <span>{recording.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{recording.views} views</span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2"
                          onClick={() => setSelectedRecording(recording)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "sessions":
        return <SessionDetails />
      case "projects":
        return <ProjectSelection />
      case "offer":
        return <OfferLetter />
      case "certificate":
        return <CertificateDownload />
      case "attendance":
        return <AttendanceView />
      case "materials":
        return <StudyMaterials />
      case "recordings":
        return <SessionRecordings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col lg:flex-row">
      {/* Mobile Header and Sidebar Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold text-gray-900">
          {userRole === "admin" ? "Admin Panel" : userRole === "mentor" ? "Mentor Hub" : "Learning Hub"}
        </h2>
        
      </div>

      {/* Sidebar */}
      <div
        className={`fixed pt-16 inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out lg:min-h-screen`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between lg:block">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {userRole === "admin" ? "Admin Panel" : userRole === "mentor" ? "Mentor Hub" : "Learning Hub"}
            </h2>
            <p className="text-sm text-gray-600 capitalize">{userRole} Dashboard</p>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {getNavigationItems().map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsSidebarOpen(false) // Close sidebar on item click for mobile
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                    {activeSection === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default ComprehensiveDashboard
