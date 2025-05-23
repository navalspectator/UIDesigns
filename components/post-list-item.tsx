"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  FileTextIcon,
  CalendarIcon,
  LightbulbIcon,
  UsersIcon,
  HelpCircleIcon,
  FolderIcon,
  BookOpenIcon,
  BriefcaseIcon,
  LockIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PostDetailsModal } from "@/components/post-details-modal"

interface PostListItemProps {
  post: {
    id: string
    title: string
    category: string
    author: {
      id: string
      name: string
      avatar: string
      affiliation: string
      sector: string
    }
    createdAt: Date
    expiresAt: Date
    description: string
    tags: string[]
    isPaywalled?: boolean
    attachments?: {
      name: string
      type: string
      url: string
    }[]
    likes: number
    comments: {
      id: string
      author: {
        id: string
        name: string
        avatar: string
      }
      content: string
      createdAt: Date
      likes: number
      replies?: {
        id: string
        author: {
          id: string
          name: string
          avatar: string
        }
        content: string
        createdAt: Date
        likes: number
      }[]
    }[]
  }
}

export function PostListItem({ post }: PostListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate days remaining until expiration
  const today = new Date()
  const daysRemaining = Math.ceil((post.expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isNearExpiration = daysRemaining <= 10

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "events":
        return <CalendarIcon className="h-5 w-5" />
      case "expertise":
        return <LightbulbIcon className="h-5 w-5" />
      case "open positions":
        return <UsersIcon className="h-5 w-5" />
      case "projects":
        return <FolderIcon className="h-5 w-5" />
      case "research":
        return <BookOpenIcon className="h-5 w-5" />
      case "partner hunt":
        return <BriefcaseIcon className="h-5 w-5" />
      default:
        return <HelpCircleIcon className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "events":
        return "bg-blue-100 text-blue-800"
      case "expertise":
        return "bg-yellow-100 text-yellow-800"
      case "open positions":
        return "bg-green-100 text-green-800"
      case "projects":
        return "bg-purple-100 text-purple-800"
      case "research":
        return "bg-indigo-100 text-indigo-800"
      case "partner hunt":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-full ${getCategoryColor(post.category)} flex-shrink-0`}>
            {getCategoryIcon(post.category)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Author */}
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                {post.isPaywalled && <LockIcon className="h-4 w-4 text-amber-500" title="Paywalled content" />}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>by {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{format(post.createdAt, "dd MMMM yyyy")}</span>
              </div>
            </div>

            {/* Full Text Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <FileTextIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Full Text</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ThumbsUpIcon className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquareIcon className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </div>
            </div>
            <div className={`text-xs ${isNearExpiration ? "text-red-500" : "text-gray-500"}`}>
              {daysRemaining > 0 ? `${daysRemaining} days left` : "Expired"}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <PostDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={post} />}
    </>
  )
}
