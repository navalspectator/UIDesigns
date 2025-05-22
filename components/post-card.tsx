"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  ThumbsUpIcon,
  MessageSquareIcon,
  BriefcaseIcon,
  CalendarIcon,
  LightbulbIcon,
  UsersIcon,
  HelpCircleIcon,
  FolderIcon,
  BookOpenIcon,
} from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PostDetailsModal } from "@/components/post-details-modal"

interface PostCardProps {
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

export function PostCard({ post }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate days remaining until expiration
  const today = new Date()
  const daysRemaining = Math.ceil((post.expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isNearExpiration = daysRemaining <= 10

  // Truncate description for card view
  const truncatedDescription =
    post.description.length > 150 ? post.description.substring(0, 150) + "..." : post.description

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
        return "bg-blue-100"
      case "expertise":
        return "bg-yellow-100"
      case "open positions":
        return "bg-green-100"
      case "projects":
        return "bg-purple-100"
      case "research":
        return "bg-indigo-100"
      case "partner hunt":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsModalOpen(true)}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${getCategoryColor(post.category)}`}>
                {getCategoryIcon(post.category)}
              </div>
              <h3 className="font-medium line-clamp-1">{post.title}</h3>
            </div>
            <p className={`text-xs ${isNearExpiration ? "text-red-500" : "text-muted-foreground"}`}>
              {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.affiliation}</p>
            </div>
          </div>

          {/* Category Badge */}
          <Badge className="mb-2" variant="secondary">
            {post.category}
          </Badge>

          <p className="text-sm mb-3 line-clamp-3">{truncatedDescription}</p>

          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-4 py-2 border-t flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <ThumbsUpIcon className="h-3.5 w-3.5" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MessageSquareIcon className="h-3.5 w-3.5" />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{format(post.createdAt, "MMM d, yyyy")}</p>
        </CardFooter>
      </Card>

      {isModalOpen && <PostDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={post} />}
    </>
  )
}
