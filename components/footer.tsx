"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MailIcon, LinkedinIcon, TwitterIcon, FacebookIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter Subscription */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/newsletter">
                <MailIcon className="h-4 w-4 mr-2" />
                Subscribe to Newsletter
              </Link>
            </Button>
          </div>

          {/* About Us */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <nav className="space-y-3">
              <Link href="/about/who-we-are" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Who we are?
              </Link>
              <Link href="/about/what-we-do" className="block text-gray-300 hover:text-white transition-colors text-sm">
                What we do?
              </Link>
              <Link
                href="/about/how-we-work"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                How we work?
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <LinkedinIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <TwitterIcon className="h-6 w-6" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* EU Funding Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-8">
              <div>
                <p className="text-xs text-gray-400 italic leading-relaxed mb-6">
                  The project "European Hub for Contemporary China (EuroHub4Sino)" has received funding from the
                  European Union's Horizon Europe research and innovation programme under grant agreement number
                  101131737. Funded by the European Union. Views and opinions expressed are however those of the
                  author(s) only and do not necessarily reflect those of the European Union or European Research
                  Executive Agency (REA). Neither the European Union nor the granting authority can be held responsible
                  for them.
                </p>

                {/* Centered EU Flag */}
                <div className="flex justify-center">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-12 bg-blue-600 rounded border border-gray-600 flex items-center justify-center relative overflow-hidden shadow-sm">
                      <div className="absolute inset-0 bg-blue-600"></div>
                      <div className="relative grid grid-cols-3 gap-0.5 text-yellow-400">
                        <div className="text-xs">★</div>
                        <div className="text-xs">★</div>
                        <div className="text-xs">★</div>
                        <div className="text-xs">★</div>
                        <div className="text-xs">★</div>
                        <div className="text-xs">★</div>
                      </div>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-xs text-gray-400 font-medium">EU</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} European Hub for Contemporary China (EuroHub4Sino). All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
