"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircleIcon, MailIcon } from "lucide-react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <MailIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Stay Connected with EuroHub4Sino</h1>
          <p className="text-lg text-gray-600">
            Get the latest insights, research updates, and news about contemporary China directly in your inbox.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscription</CardTitle>
            <CardDescription>Join our community of researchers, policymakers, and China experts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Successfully Subscribed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for subscribing to our newsletter. You'll receive our latest updates soon.
                </p>
                <Button onClick={() => setIsSubscribed(false)} variant="outline">
                  Subscribe Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    By subscribing, you agree to receive our newsletter and updates. You can unsubscribe at any time.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll receive:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Research Updates</h4>
              <p className="text-gray-600">Latest research findings and publications from our network</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Event Notifications</h4>
              <p className="text-gray-600">Workshops, conferences, and networking opportunities</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Policy Insights</h4>
              <p className="text-gray-600">Analysis of current developments and policy changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
