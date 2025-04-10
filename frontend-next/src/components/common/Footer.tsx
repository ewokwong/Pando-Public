import type React from "react"
import Link from "next/link"
import { ExternalLink, Mail, Instagram, Heart } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-md text-white pt-10 pb-6 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex justify-start items-center mb-5">
              <img
                src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1742612869/Pando/mzmqqozsnnlip70xwlef.svg"
                alt="Pando Logo"
                className="h-14 w-auto rounded-md"
              />
            </div>
            <p className="text-gray-300 text-sm mb-5 leading-relaxed">
              Connecting tennis enthusiasts and building a community of players. Join us to find your perfect tennis
              match!
            </p>
            <div className="flex space-x-5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pando_tennis?igsh=MTh5ajdwbnlidThkZw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <div className="bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-yellow-500/20 p-2 rounded-lg hover:bg-gradient-to-tr hover:from-purple-500/30 hover:via-pink-500/30 hover:to-yellow-500/30 transition-all">
                  <Instagram className="h-5 w-5" />
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pando_tennis?_t=ZS-8vKpeTfUFYP&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <div className="bg-black/30 p-2 rounded-lg hover:bg-black/40 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M15 8v8a4 4 0 0 1-4 4" />
                    <line x1="15" y1="4" x2="15" y2="12" />
                  </svg>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:pandotennis@gmail.com"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <div className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition-all">
                  <Mail className="h-5 w-5" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 md:ml-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/our-mission"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm inline-flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-white">Get Involved</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://forms.gle/YPVGQJH2FMVG95YJ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  <span>Submit a Resource Idea</span>
                  <ExternalLink size={12} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/qYkeESNqfkK61w847"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  <span>UTR Form</span>
                  <ExternalLink size={12} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/i29f223SgHgJ2isP6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 opacity-75"></span>
                  <span>Feedback Form</span>
                  <ExternalLink size={12} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center group">
                <a
                  href="https://www.instagram.com/pando_tennis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition-colors flex items-center"
                >
                  <div className="bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-yellow-500/20 p-1.5 rounded-md mr-2 flex-shrink-0">
                    <Instagram size={14} />
                  </div>
                  <span className="text-sm">@pando_tennis</span>
                  <ExternalLink size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>

              <li className="flex items-center group">
                <a
                  href="https://www.tiktok.com/@pando_tennis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-gray-100 transition-colors flex items-center"
                >
                  <div className="bg-black/30 p-1.5 rounded-md mr-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                      <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                      <path d="M15 8v8a4 4 0 0 1-4 4" />
                      <line x1="15" y1="4" x2="15" y2="12" />
                    </svg>
                  </div>
                  <span className="text-sm">@pando_tennis</span>
                  <ExternalLink size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="mailto:pandotennis@gmail.com"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <div className="bg-blue-500/20 p-1.5 rounded-md mr-2 flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  <span className="text-sm">pandotennis@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm flex items-center">
              © {new Date().getFullYear()} Pando Tennis. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

