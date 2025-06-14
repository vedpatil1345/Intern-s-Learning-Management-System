"use client"
import { useState } from "react"
import logo from "../assets/logo.svg"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import UserMenu from "./user"
import { Button } from "./ui/button"
import { Menu, X, Home, LayoutDashboard, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const Navbar = () => {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]

  const handleLogin = () => {
    router.push("/sign-in")
    setIsMenuOpen(false)
  }

  const handleSignUp = () => {
    router.push("/apply")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="IOTechz Logo"
                  width={50}
                  height={36}
                  className="transition-transform group-hover:scale-105 duration-200"
                />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IOTechz
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              // Hide dashboard for non-authenticated users
              if (!user && item.href === "/dashboard") {
                return null
              }

              return (
                <div className="relative" key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50 shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleLogin}
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              // Hide dashboard for non-authenticated users
              if (!user && item.href === "/dashboard") {
                return null
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="px-2">
                  <UserMenu />
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleLogin}
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign In
                  </Button>
                  <Button
                    onClick={handleSignUp}
                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
