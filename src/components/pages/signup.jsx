"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "@/assets/logo.svg"
import { useAuth } from "@/hooks/useAuth"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, Shield, Users, Award, File, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfile } from "@/hooks/useProfile"

const SignUpPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const {id}=useProfile()
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    internshipTitle: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push(redirect)
    }
  }, [user, loading, router, redirect])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
    setError("")
    setSuccess("")
  }

  // Add a specific handler for the Select component
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear field-specific error when user selects
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
    setError("")
    setSuccess("")
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setFieldErrors(prev => ({
          ...prev,
          resume: 'Please upload only PDF or DOCX files'
        }))
        return
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({
          ...prev,
          resume: 'File size should not exceed 5MB'
        }))
        return
      }

      setSelectedFile(file)
      // Clear resume error when valid file is selected
      if (fieldErrors.resume) {
        setFieldErrors(prev => ({
          ...prev,
          resume: ""
        }))
      }
      setError('')
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    // Clear the file input
    const fileInput = document.getElementById('resume')
    if (fileInput) fileInput.value = ''
    // Add error for required resume
    setFieldErrors(prev => ({
      ...prev,
      resume: 'Resume is required'
    }))
  }

  const validateForm = () => {
    const errors = {}
    let isValid = true

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
      isValid = false
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters"
      isValid = false
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
      isValid = false
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email address is required"
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address"
        isValid = false
      }
    }

    // Resume validation
    if (!selectedFile) {
      errors.resume = "Resume is required"
      isValid = false
    }

    // Internship title validation
    if (!formData.internshipTitle) {
      errors.internshipTitle = "Please select an internship title"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
      isValid = false
    } else {
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      if (!passwordRegex.test(formData.password)) {
        errors.password = "Password must be at least 8 characters with a number and a special character"
        isValid = false
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    // Terms acceptance validation
    if (!acceptTerms) {
      errors.terms = "Please accept the terms and conditions"
      isValid = false
    }

    setFieldErrors(errors)
    
    if (!isValid) {
      setError("Please correct the errors below")
    }
    
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('id', id)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('first_name', formData.firstName)
      formDataToSend.append('last_name', formData.lastName)
      formDataToSend.append('internship_title', formData.internshipTitle)

      if (selectedFile) {
        formDataToSend.append('resume', selectedFile)
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setSuccess("Application successful! Please check your email to verify your account.")
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        internshipTitle: "",
      })
      setSelectedFile(null)
      setAcceptTerms(false)
      setFieldErrors({})

      // Clear file input
      const fileInput = document.getElementById('resume')
      if (fileInput) fileInput.value = ''

      setTimeout(() => router.push("/sign-in"), 2000)
    } catch (err) {
      setError(err.message || "Application failed. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
          {/* Left Panel - Enhanced Design */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center px-8 xl:px-12 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-8">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="IOTechz Logo"
                  width={180}
                  height={90}
                  className="mb-6 brightness-100 hover:brightness-110 transition-all duration-200"
                />
              </div>

              <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight text-gray-700">
                Start Your Journey with
                <span className="block bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                  IOTechz
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                Kickstart your tech career with our comprehensive hands-on internship programs. Sign up now and take the first step toward your professional journey.
              </p>
            </div>
          </div>

          {/* Right Panel - Enhanced Form */}
          <div className="px-6 sm:px-8 lg:px-12 py-3 bg-white">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src={logo || "/placeholder.svg"}
                alt="IOTechz Logo"
                width={160}
                height={80}
                className=" mx-auto"
              />
              <h2 className="text-3xl font-bold text-blue-600 mb-2">Apply Now</h2>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <h2 className="text-3xl xl:text-4xl font-bold text-blue-600 mb-5">Apply Now</h2>
            </div>

            <div className="space-y-4">
              {(error || success) && (
                <div
                  className={`border-l-4 px-4 py-3 rounded-lg text-sm flex items-center ${error ? "bg-red-50 border-red-400 text-red-700" : "bg-green-50 border-green-400 text-green-700"
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-xs font-bold mr-3 ${error ? "bg-red-400" : "bg-green-400"
                      }`}
                  >
                    {error ? "!" : "✓"}
                  </div>
                  {error || success}
                </div>
              )}

              {/* Enhanced Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                          fieldErrors.firstName 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Enter first name"
                      />
                    </div>
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                          fieldErrors.lastName 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Enter last name"
                      />
                    </div>
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                          fieldErrors.email 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Resume <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.docx"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="resume"
                        className={`flex items-center w-full pl-10 pr-3 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 hover:bg-white cursor-pointer ${
                          fieldErrors.resume 
                            ? 'border-red-300' 
                            : 'border-gray-300'
                        }`}
                      >
                        <File className="h-5 w-5 text-gray-400 absolute left-3" />
                        <span className="text-gray-500">
                          {selectedFile ? selectedFile.name : "Choose PDF or DOCX file"}
                        </span>
                      </label>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-gray-50"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {fieldErrors.resume && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.resume}</p>
                    )}
                    {selectedFile && !fieldErrors.resume && (
                      <p className="mt-1 text-xs text-green-600">
                        File selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="internshipTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                    Internship Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select
                      value={formData.internshipTitle}
                      onValueChange={(value) => handleSelectChange("internshipTitle", value)}
                    >
                      <SelectTrigger className={`pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                        fieldErrors.internshipTitle 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}>
                        <SelectValue placeholder="Select internship title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullStack">Full Stack Intern</SelectItem>
                        <SelectItem value="Flutter">Flutter Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldErrors.internshipTitle && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.internshipTitle}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                          fieldErrors.password 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Create your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                    {!fieldErrors.password && (
                      <p className="mt-2 text-xs text-gray-500">
                        Must be at least 8 characters with a number and special character
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-2 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white ${
                          fieldErrors.confirmPassword 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked)
                      if (fieldErrors.terms) {
                        setFieldErrors(prev => ({
                          ...prev,
                          terms: ""
                        }))
                      }
                    }}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <div>
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
                      I accept the{" "}
                      <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                    {fieldErrors.terms && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.terms}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating your account...
                      </div>
                    ) : (
                      <>
                        Apply
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center w-full py-2 px-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Sign In Instead
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage