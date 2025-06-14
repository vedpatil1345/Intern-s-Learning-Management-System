"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  User,
  Mail,
  FileText,
  Award,
  Calendar,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Badge,
  Briefcase,
  GraduationCap,
} from "lucide-react"

const ProfilePage = () => {
  const { user } = useAuth()
  const { profile, isLoading, error: profileError, setProfile } = useProfile(user)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [batch, setBatch] = useState("")
  const [internshipTitle, setInternshipTitle] = useState("")
  const [resume, setResume] = useState(null)
  const [resumeUrl, setResumeUrl] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync form fields with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setEmail(profile.email || user?.email || "")
      setBatch(profile.batch || "")
      setInternshipTitle(profile.internship_title || "")
      setResumeUrl(profile.resume || "")
    }
  }, [profile, user?.email])

  // Handle resume upload with validation
  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setResume(file)
    setResumeUrl(file.name) // Show filename as preview
  }

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    setError("No user logged in");
    return;
  }

  // Basic form validation
  if (!email || !firstName || !lastName || !internshipTitle) {
    setError("All fields except resume are required");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Invalid email format");
    return;
  }

  setIsSubmitting(true);
  setError("");

  let resumePath = profile?.resume;
  let newFileName = "";

  try {
    // Upload resume if changed
    if (resume) {
      const fileExt = resume.name.split(".").pop();
      newFileName = `${user.id}-resume-${Date.now()}.${fileExt}`;

      // Delete old resume if it exists
      if (profile?.resume) {
        let oldFilePath = profile.resume.split("/").pop();
        const { error: deleteError } = await supabase.storage.from("resumes").remove([oldFilePath]);
        if (deleteError) {
          console.error("Failed to delete old resume:", deleteError);
        }
      }

      // Upload new resume
      console.log('Uploading resume:', newFileName);
      const { error: uploadError } = await supabase.storage.from("resumes").upload(newFileName, resume);

      if (uploadError) {
        console.error('Resume upload error:', uploadError.message, uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(newFileName);
      if (!urlData.publicUrl) throw new Error("Failed to get resume URL");
      resumePath = urlData.publicUrl;
    }

    // Update profile in interns table
    const updates = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      internship_title: internshipTitle,
      resume: resumePath,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase.from("user").update(updates).eq("id", user.id);

    if (updateError) {
      if (newFileName) {
        await supabase.storage.from("resumes").remove([newFileName]);
      }
      throw updateError;
    }

    // Update email in auth if changed
    if (email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) throw authError;
    }

    setProfile({ ...profile, ...updates });
    setResume(null);
    setIsEditing(false);
  } catch (err) {
    console.error("Profile update error:", err);
    setError(err.message || "Failed to update profile");
  } finally {
    setIsSubmitting(false);
  }
};

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setFirstName(profile?.first_name || "")
    setLastName(profile?.last_name || "")
    setEmail(profile?.email || user?.email || "")
    setInternshipTitle(profile?.internship_title || "")
    setResume(null)
    setResumeUrl(profile?.resume || "")
    setError("")
  }

  // Helper function to get status display
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

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (profileError || (!profile && !isLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Error</h2>
            <p className="text-gray-600 mb-6">{profileError || "Please log in to view your profile."}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(profile.application_status)
  const StatusIcon = statusDisplay.icon
  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User"
  const initial = (profile.first_name || profile.email || "U").charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                  {initial}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  <p className="text-blue-100 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </p>
                  <div className="flex items-center mt-2">
                    <Badge className="w-4 h-4 mr-2" />
                    <span className="text-blue-100">{profile.type || "Student"}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30`}
                >
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {statusDisplay.text}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  Profile Information
                </h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center mb-6">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">First Name</p>
                        <p className="text-gray-900">{profile.first_name || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Name</p>
                        <p className="text-gray-900">{profile.last_name || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Batch</p>
                        <p className="text-gray-900">{profile.batch || "Not set"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Internship Title</p>
                      <p className="text-gray-900">{profile.internship_title || "Not set"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter first name"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter last name"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter email address"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Internship Title</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={internshipTitle}
                        onChange={(e) => setInternshipTitle(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter desired internship title"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resume</label>
                    {resumeUrl && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Current:{" "}
                          {typeof resumeUrl === "string" && resumeUrl.includes("http") ? (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline flex items-center inline-flex"
                            >
                              View current resume
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          ) : (
                            <span className="font-medium">{resumeUrl}</span>
                          )}
                        </p>
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isSubmitting}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (max 10MB)</p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Badge className="w-5 h-5 mr-2 text-blue-600" />
                Application Status
              </h3>
              <div
                className={`p-4 rounded-xl ${statusDisplay.bgColor} ${statusDisplay.borderColor} border-2 text-center`}
              >
                <StatusIcon className={`w-8 h-8 mx-auto mb-2 ${statusDisplay.color}`} />
                <p className={`font-semibold ${statusDisplay.color}`}>{statusDisplay.text}</p>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Documents
              </h3>
              <div className="space-y-3">
                {profile.resume ? (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 text-sm text-blue-700 group"
                  >
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Resume
                    </div>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    No resume uploaded
                  </div>
                )}

                {profile.cert_issued && profile.certificate_url ? (
                  <a
                    href={profile.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 text-sm text-green-700 group"
                  >
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Certificate
                    </div>
                    <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
                  </a>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
                    <Award className="w-4 h-4 mx-auto mb-1" />
                    Certificate not issued
                  </div>
                )}
              </div>
            </div>

            {/* Profile Stats */}
            {profile.created_at && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Account Info
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-500">Days with IOTechz</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProfilePage }
