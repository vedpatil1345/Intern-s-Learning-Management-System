"use client"
import logo from "@/assets/logo.svg"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  Code,
  Smartphone,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"

const HomePage = () => {
  const { user } = useAuth()

  const internshipPrograms = [
    {
      title: "Flutter Development Intern",
      description: "Build cross-platform mobile applications using Flutter and Dart. Work on real client projects.",
      icon: Smartphone,
      duration: "3-6 months",
      skills: ["Flutter", "Dart", "Firebase", "REST APIs", "UI/UX Design"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Full Stack Development Intern",
      description: "Master both frontend and backend technologies. Create complete web applications from scratch.",
      icon: Code,
      duration: "4-6 months",
      skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
      color: "from-purple-500 to-pink-500",
    }
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning Path",
      description: "Follow a carefully designed curriculum with hands-on projects and real-world applications.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics, milestones, and achievement badges.",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Get guidance from industry professionals with years of experience in your chosen field.",
    },
    {
      icon: Award,
      title: "Industry Certification",
      description: "Earn recognized certificates upon completion to boost your career prospects.",
    },
  ]



  return (
    <div className=" bg-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Image
            src={logo || "/placeholder.svg"}
            alt="IOTechz Logo"
            width={250}
            height={90}
            className="mb-6 brightness-100 hover:brightness-110 transition-all duration-200 mx-auto"
          />
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Launch Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Tech Career
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join IOTechz's comprehensive internship program and transform from a beginner to industry-ready professional
            with hands-on projects, expert mentorship, and real-world experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                  >
                    Login to Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Internship Programs */}
      <section className="min-h-screen py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our specialized internship programs designed to match your interests and career goals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {internshipPrograms.map((program, index) => {
              const IconComponent = program.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                  ></div>

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${program.color} text-white mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>

                  <div className="flex items-center mb-6">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      Duration: {program.duration}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Key Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose IOTechz?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach ensures you get the best learning experience and career preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl mb-6">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of successful interns who have launched their tech careers with IOTechz. Apply now and take
            the first step towards your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!user && (
              <>
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                  >
                    Apply for Internship
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 rounded-xl border-2 border-white text-black hover:bg-white hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"
                  >
                    Login to Dashboard
                  </Button>
                </Link>
              </>
            )}
            {user && (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                >
                  Continue Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Industry Mentors</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Job Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
