"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  BookmarkIcon,
  Share2Icon,
  ThumbsUpIcon,
  FlagIcon,
  XIcon,
  SendIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  LightbulbIcon,
  UsersIcon,
  HelpCircleIcon,
  FolderIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PostDetailsModalProps {
  isOpen: boolean
  onClose: () => void
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

export function PostDetailsModal({ isOpen, onClose, post }: PostDetailsModalProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [reportText, setReportText] = useState("")
  const [isReporting, setIsReporting] = useState(false)
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null)

  // Calculate days remaining until expiration
  const today = new Date()
  const daysRemaining = Math.ceil((post.expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isExpired = daysRemaining <= 0

  // Truncate description if it's too long
  const shouldTruncate = post.description.length > 300
  const truncatedDescription =
    shouldTruncate && !showFullDescription ? post.description.substring(0, 300) + "..." : post.description

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    // Implement internal sharing functionality
    console.log("Sharing post:", post.id)
  }

  const handleContactAuthor = () => {
    // Open message box with author pre-filled
    console.log("Contacting author:", post.author.name)
  }

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      console.log("Submitting comment:", commentText)
      setCommentText("")
    }
  }

  const handleSubmitReport = () => {
    if (reportText.trim()) {
      if (reportingCommentId) {
        console.log("Reporting comment:", reportingCommentId, "Reason:", reportText)
      } else {
        console.log("Reporting post:", post.id, "Reason:", reportText)
      }
      // Send report to moderator, admin, and specified email
      setIsReporting(false)
      setReportingCommentId(null)
      setReportText("")
    }
  }

  const handleEditComment = (commentId: string) => {
    console.log("Editing comment:", commentId)
    // Implement edit functionality
  }

  const handleDeleteComment = (commentId: string) => {
    console.log("Deleting comment:", commentId)
    // Implement delete functionality
  }

  const handleReportComment = (commentId: string) => {
    setReportingCommentId(commentId)
    setIsReporting(true)
  }

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="text-left p-0 mb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Badge className={`px-3 py-1 ${getCategoryColor(post.category)}`}>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(post.category)}
                  <span>{post.category}</span>
                </span>
              </Badge>
              <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
            </div>
            <DialogClose className="h-6 w-6 opacity-70 hover:opacity-100">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Author Section - Redesigned to match screenshot */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg?height=48&width=48"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{post.author.name}</h3>
                <p className="text-muted-foreground">{post.author.affiliation}</p>
                <p className="text-muted-foreground text-sm mt-1">Posted on {format(post.createdAt, "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleBookmark}>
              <BookmarkIcon className="h-4 w-4 mr-1" />
              <span>Save</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Share2Icon className="h-4 w-4 mr-1" />
              <span>Share</span>
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={handleContactAuthor}>
              Contact
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-4 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Content Section */}
        <div className="mb-6">
          <p className="text-base leading-relaxed">
            {truncatedDescription}
            {shouldTruncate && (
              <Button
                variant="link"
                className="px-1 h-auto"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </Button>
            )}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Engagement Section - Redesigned to match screenshot */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 p-0 h-auto ${isLiked ? "text-primary" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUpIcon className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
              <span className="text-base">{isLiked ? post.likes + 1 : post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 p-0 h-auto ${isBookmarked ? "text-primary" : ""}`}
              onClick={handleBookmark}
            >
              <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? "fill-primary" : ""}`} />
              <span className="text-base">Save</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto" onClick={handleShare}>
              <Share2Icon className="h-5 w-5" />
              <span className="text-base">Share</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-0 h-auto text-muted-foreground"
            onClick={() => setIsReporting(true)}
          >
            <FlagIcon className="h-5 w-5" />
            <span className="text-base">Report</span>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Comment Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Comments ({post.comments.length})</h3>

          {/* Add Comment */}
          <div className="flex gap-3 items-start">
            <Avatar className="h-10 w-10 mt-1">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                className="min-h-[80px] flex-1"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                size="icon"
                className="mt-auto bg-gray-200 hover:bg-gray-300 text-black"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6 mt-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{comment.author.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {format(comment.createdAt, "MMMM d, yyyy")}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVerticalIcon className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditComment(comment.id)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReportComment(comment.id)}>
                            <FlagIcon className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex gap-4 mt-2">
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-sm">
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-sm flex items-center gap-1">
                        <ThumbsUpIcon className="h-3.5 w-3.5" />
                        <span>{comment.likes}</span>
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 mt-3 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                              <AvatarFallback>{reply.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-sm">{reply.author.name}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {format(reply.createdAt, "MMMM d, yyyy")}
                                  </span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreVerticalIcon className="h-3 w-3" />
                                      <span className="sr-only">More options</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditComment(reply.id)}>
                                      <PencilIcon className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteComment(reply.id)}>
                                      <TrashIcon className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleReportComment(reply.id)}>
                                      <FlagIcon className="h-4 w-4 mr-2" />
                                      Report
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                              <div className="flex gap-4 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs flex items-center gap-1"
                                >
                                  <ThumbsUpIcon className="h-3 w-3" />
                                  <span>{reply.likes}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Dialog */}
        {isReporting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full space-y-4">
              <h3 className="font-bold text-lg">{reportingCommentId ? "Report Comment" : "Report Post"}</h3>
              <p className="text-sm">
                Please explain why you think this {reportingCommentId ? "comment" : "post"} is unsuitable.
              </p>
              <Textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Provide details about your report..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReporting(false)
                    setReportingCommentId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitReport} disabled={!reportText.trim()}>
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
