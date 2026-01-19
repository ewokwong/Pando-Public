import type React from "react"
import Link from "next/link"
import { ExternalLink, Mail, Instagram } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-md text-white pt-10 pb-6 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex justify-start items-center mb-5">
              <img
                src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1768800568/Pando_logo_b7x06s.png"
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
              {/* <a
                href="https://www.instagram.com/pando_tennis?igsh=MTh5ajdwbnlidThkZw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <div className="from-purple-500/20 via-pink-500/20 to-yellow-500/20 p-2 rounded-lg hover:bg-gradient-to-tr hover:from-purple-500/30 hover:via-pink-500/30 hover:to-yellow-500/30 transition-all hover:shadow-lg hover:shadow-pink-500/10">
                  <Instagram className="h-5 w-5" />
                </div>
              </a> */}

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pando_tennis?_t=ZS-8vKpeTfUFYP&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <div className="bg-black/30 p-2 rounded-lg hover:bg-black/40 transition-all hover:shadow-lg hover:shadow-white/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.321 5.562a5.124 5.124 0 0 1-3.414-1.267 5.124 5.124 0 0 1-1.537-3.168h-3.766v13.206c0 1.55-1.257 2.807-2.807 2.807a2.807 2.807 0 0 1-2.807-2.807 2.807 2.807 0 0 1 2.807-2.807c.193 0 .381.019.562.055V7.725a6.641 6.641 0 0 0-.562-.024 6.58 6.58 0 0 0-6.58 6.58A6.58 6.58 0 0 0 7.797 20.86a6.58 6.58 0 0 0 6.58-6.58V9.07a8.726 8.726 0 0 0 4.944 1.525V6.83c-.001 0-.001 0 0 0v-1.27Z" />
                  </svg>
                </div>
              </a>

              {/* X */}
              <a
                href="https://x.com/pandotennis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="X"
              >
                <div className="p-2 rounded-lg hover:bg-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:pandotennis@gmail.com"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <div className="p-2 rounded-lg hover:bg-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10">
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

              {/* Instagram */}
              {/* <li className="flex items-center group">
                <a
                  href="https://www.instagram.com/pando_tennis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition-colors flex items-center"
                >
                  <div className="from-purple-500/20 via-pink-500/20 to-yellow-500/20 p-1.5 rounded-md mr-2 flex-shrink-0 group-hover:from-purple-500/30 group-hover:via-pink-500/30 group-hover:to-yellow-500/30 transition-all">
                    <Instagram size={14} />
                  </div>
                  <span className="text-sm">@pando_tennis</span>
                  <ExternalLink size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li> */}

              {/* Tiktok */}
              <li className="flex items-center group">
                <a
                  href="https://www.tiktok.com/@pando_tennis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-gray-100 transition-colors flex items-center"
                >
                  <div className="bg-black/30 p-1.5 rounded-md mr-2 flex-shrink-0 group-hover:bg-black/40 transition-all">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.321 5.562a5.124 5.124 0 0 1-3.414-1.267 5.124 5.124 0 0 1-1.537-3.168h-3.766v13.206c0 1.55-1.257 2.807-2.807 2.807a2.807 2.807 0 0 1-2.807-2.807 2.807 2.807 0 0 1 2.807-2.807c.193 0 .381.019.562.055V7.725a6.641 6.641 0 0 0-.562-.024 6.58 6.58 0 0 0-6.58 6.58A6.58 6.58 0 0 0 7.797 20.86a6.58 6.58 0 0 0 6.58-6.58V9.07a8.726 8.726 0 0 0 4.944 1.525V6.83c-.001 0-.001 0 0 0v-1.27Z" />
                    </svg>
                  </div>
                  <span className="text-sm">@pando_tennis</span>
                  <ExternalLink size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>

              {/* X */}
              <li className="flex items-center group">
                <a
                  href="https://x.com/pandotennis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <div className="p-1.5 rounded-md mr-2 flex-shrink-0 group-hover:bg-blue-500/30 transition-all">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-sm">@pandotennis</span>
                  <ExternalLink size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="mailto:pandotennis@gmail.com"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <div className="p-1.5 rounded-md mr-2 flex-shrink-0 group-hover:bg-blue-500/30 transition-all">
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
