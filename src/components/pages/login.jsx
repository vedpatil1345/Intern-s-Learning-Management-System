"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "@/assets/logo.svg"
import { useAuth } from "@/hooks/useAuth"
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, Shield, Users, Award } from "lucide-react"

const LoginPage = () => {
  const { user, loading, signInWithEmail } = useAuth()

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Check for OAuth errors from URL params and redirect if authenticated
  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError) {
      setError(decodeURIComponent(urlError))
    }
    if (!loading && user) {
      router.push(redirect)
    }
  }, [searchParams, user, loading, router, redirect])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signInWithEmail(formData.email, formData.password)
      // Redirect handled by useEffect when user updates
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.")
      console.error("Login error:", err)
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
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
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
                Welcome Back to
                <span className="block bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                  IOTechz
                </span>
              </h2>

              <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                Continue your journey to becoming a tech professional. Access your personalized learning dashboard and
                track your progress.
              </p>
            </div>
          </div>

          {/* Right Panel - Enhanced Form */}
          <div className="p-6 sm:p-8 lg:p-12 bg-white">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src={logo || "/placeholder.svg"}
                alt="IOTechz Logo"
                width={160}
                height={80}
                className="mb-4 mx-auto"
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your learning journey</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-3">Sign In</h2>
              <p className="text-gray-600 text-lg">Access your personalized learning dashboard</p>
            </div>

            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                  <div className="w-5 h-5 rounded-full bg-red-400 text-white flex items-center justify-center text-xs font-bold mr-3">
                    !
                  </div>
                  {error}
                </div>
              )}

              {/* Enhanced Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
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
                        className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
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
                        className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                        placeholder="Enter your password"
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
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading || isOAuthLoading}
                    className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Signing you in...
                      </div>
                    ) : (
                      <>
                        Sign In
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
                    <span className="px-4 bg-white text-gray-500 font-medium">New to IOTechz?</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/apply"
                    className="inline-flex items-center justify-center w-full py-4 px-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Apply for Internship
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

export default LoginPage
