"use client"
import Image from "next/image"
import Link from "next/link"
import logo from "../assets/logo.svg"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
  ]

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 shadow-lg">
      <div className="mx-auto px-4 pt-5 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-6 group">
              <Image
                src={logo || "/placeholder.svg"}
                alt="IOTechz Logo"
                width={50}
                height={36}
                className="transition-transform group-hover:scale-105"
              />
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                IOTechz
              </span>
            </Link>
            <p className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed">
              Leading the future of IoT technology with innovative solutions that connect, monitor, and optimize your
              world.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">xxxxxxxxxxx@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">+91 1234567890</span>
              </div>
              <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">xxxxxxxxxxxxxxxxxxxx</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-5 pt-5 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-6 md:mb-0 font-medium">
              © {currentYear} IOTechz. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 pb-5">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="bg-white text-gray-600 hover:text-white hover:bg-blue-600 transition-all duration-200 p-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
