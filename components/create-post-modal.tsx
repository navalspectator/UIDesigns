"use client"

import type React from "react"

import { useState, useRef } from "react"
import { format } from "date-fns"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CreditCardIcon,
  FileIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  LockIcon,
  PenLineIcon,
  PhoneIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
  UnderlineIcon,
  UploadIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FileWithPreview extends File {
  preview?: string
  id: string
}

interface RichTextCommand {
  icon: React.ReactNode
  label: string
  command: string
  type?: string
}

const categories = [
  { value: "events", label: "Events" },
  { value: "expertise", label: "Expertise" },
  { value: "open-positions", label: "Open Positions" },
  { value: "other", label: "Other" },
  { value: "projects", label: "Projects" },
  { value: "research", label: "Research" },
  { value: "partner-hunt", label: "Partner Hunt" },
]

// Extended list of tags to demonstrate the scrollable functionality
const tags = [
  "Conference",
  "Consultancy",
  "Funding",
  "Interview",
  "Partner Hunt",
  "Publication",
  "Survey",
  "Training",
  "Workshop",
  "Research",
  "Project",
  "Networking",
  "Biotech",
  "Climate Change",
  "Conservation",
  "Economic Relations",
  "Environmental Policy",
  "Fiscal Policy",
  "Foreign Policy",
  "Global Governance",
  "Green Tech",
  "ICT and Telecom",
  "Intelligence and Security",
  "International Finance",
  "Maritime Security",
  "Military Technology",
  "Nuclear Policy",
  "Public Health",
  "Renewable Energy",
  "Space Technology",
  "Sustainable Development",
  "Trade Policy",
  "Urban Planning",
  "Water Resources",
]

// Time options in 30-minute intervals
const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const formattedHour = hour.toString().padStart(2, "0")
  return {
    value: `${formattedHour}:${minute}`,
    label: `${formattedHour}:${minute}`,
  }
})

// Boolean options for demonstration
const booleanOptions = [
  { id: "is-featured", label: "Feature this post" },
  { id: "is-urgent", label: "Mark as urgent" },
  { id: "allow-comments", label: "Allow comments" },
  { id: "notify-subscribers", label: "Notify subscribers" },
  { id: "is-private", label: "Private post (only visible to members)" },
]

// Rich text editor commands
const formatCommands: RichTextCommand[] = [
  { icon: <BoldIcon className="h-4 w-4" />, label: "Bold", command: "bold" },
  { icon: <ItalicIcon className="h-4 w-4" />, label: "Italic", command: "italic" },
  { icon: <UnderlineIcon className="h-4 w-4" />, label: "Underline", command: "underline" },
]

const headingCommands: RichTextCommand[] = [
  { icon: <Heading1Icon className="h-4 w-4" />, label: "Heading 1", command: "formatBlock", type: "h1" },
  { icon: <Heading2Icon className="h-4 w-4" />, label: "Heading 2", command: "formatBlock", type: "h2" },
]

const listCommands: RichTextCommand[] = [
  { icon: <ListIcon className="h-4 w-4" />, label: "Bullet List", command: "insertUnorderedList" },
  { icon: <ListOrderedIcon className="h-4 w-4" />, label: "Numbered List", command: "insertOrderedList" },
]

const alignmentCommands: RichTextCommand[] = [
  { icon: <AlignLeftIcon className="h-4 w-4" />, label: "Align Left", command: "justifyLeft" },
  { icon: <AlignCenterIcon className="h-4 w-4" />, label: "Align Center", command: "justifyCenter" },
  { icon: <AlignRightIcon className="h-4 w-4" />, label: "Align Right", command: "justifyRight" },
]

const otherCommands: RichTextCommand[] = [
  { icon: <LinkIcon className="h-4 w-4" />, label: "Insert Link", command: "createLink" },
]

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [expiryTime, setExpiryTime] = useState("23:59")
  const [showAllTags, setShowAllTags] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState("")
  const [booleanValues, setBooleanValues] = useState<Record<string, boolean>>({
    "is-featured": false,
    "is-urgent": false,
    "allow-comments": true,
    "notify-subscribers": false,
    "is-private": false,
  })
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [iban, setIban] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Number of tags to show initially
  const initialTagsCount = 10

  // Filter tags based on search query
  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))

  // Display tags - either all or just the initial count
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, initialTagsCount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get the HTML content from the editor
    const editorContent = editorRef.current?.innerHTML || ""

    // Create post object with date and time
    const post = {
      title,
      category,
      description: editorContent,
      tags: selectedTags,
      keywords,
      phoneNumber,
      iban,
      expiryDateTime: expiryDate
        ? new Date(
            expiryDate.getFullYear(),
            expiryDate.getMonth(),
            expiryDate.getDate(),
            Number.parseInt(expiryTime.split(":")[0]),
            Number.parseInt(expiryTime.split(":")[1]),
          )
        : undefined,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      ...booleanValues,
    }

    console.log("Creating post:", post)

    // Reset form
    setTitle("")
    setCategory("")
    setDescription("")
    setSelectedTags([])
    setExpiryDate(undefined)
    setExpiryTime("23:59")
    setShowAllTags(false)
    setTagSearchQuery("")
    setBooleanValues({
      "is-featured": false,
      "is-urgent": false,
      "allow-comments": true,
      "notify-subscribers": false,
      "is-private": false,
    })
    setFiles([])
    setKeywords([])
    setKeywordInput("")
    setPhoneNumber("")
    setIban("")

    // Reset editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }

    // Close modal
    onClose()
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleBooleanToggle = (id: string) => {
    setBooleanValues((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Rich text editor command handler
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  // Handle special commands that need user input
  const handleSpecialCommand = (command: string) => {
    if (command === "createLink") {
      const url = prompt("Enter the URL:", "https://")
      if (url) {
        executeCommand("createLink", url)
      }
    }
  }

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((file) => file.id !== id)
    })
  }

  // Keywords/list field handlers
  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key === "Enter") && keywordInput.trim()) {
      e.preventDefault()
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords((prev) => [...prev, keywordInput.trim()])
      }
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword))
  }

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format the phone number as needed
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}${digits.length > 10 ? `-${digits.slice(10)}` : ""}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
  }

  // IBAN formatting
  const formatIban = (value: string) => {
    // Remove all spaces and convert to uppercase
    const cleaned = value.replace(/\s/g, "").toUpperCase()

    // Add a space every 4 characters
    return cleaned.replace(/(.{4})/g, "$1 ").trim()
  }

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatIban(value)
    setIban(formatted)
  }

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return null // Will use preview for images
    } else if (fileType.includes("pdf")) {
      return <FileIcon className="h-6 w-6 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileIcon className="h-6 w-6 text-blue-500" />
    } else if (fileType.includes("excel") || fileType.includes("sheet")) {
      return <FileIcon className="h-6 w-6 text-green-500" />
    } else if (fileType.includes("presentation") || fileType.includes("powerpoint")) {
      return <FileIcon className="h-6 w-6 text-orange-500" />
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 bg-gray-50 border-b sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <PenLineIcon className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">Create Post</DialogTitle>
            </div>
            <DialogClose className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new post. Fields marked with * are required.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-14 text-base"
            />
          </div>

          {/* Rich Text Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description
            </Label>
            <div className="border rounded-md overflow-hidden">
              {/* Rich Text Toolbar */}
              <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
                <TooltipProvider>
                  {/* Format Group */}
                  <div className="flex items-center mr-2">
                    {formatCommands.map((cmd) => (
                      <Tooltip key={cmd.command}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => executeCommand(cmd.command)}
                          >
                            {cmd.icon}
                            <span className="sr-only">{cmd.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{cmd.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <Separator orientation="vertical" className="h-8 mx-1" />

                  {/* Heading Group */}
                  <div className="flex items-center mr-2">
                    {headingCommands.map((cmd) => (
                      <Tooltip key={cmd.command + (cmd.type || "")}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => executeCommand(cmd.command, cmd.type)}
                          >
                            {cmd.icon}
                            <span className="sr-only">{cmd.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{cmd.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <Separator orientation="vertical" className="h-8 mx-1" />

                  {/* List Group */}
                  <div className="flex items-center mr-2">
                    {listCommands.map((cmd) => (
                      <Tooltip key={cmd.command}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => executeCommand(cmd.command)}
                          >
                            {cmd.icon}
                            <span className="sr-only">{cmd.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{cmd.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <Separator orientation="vertical" className="h-8 mx-1" />

                  {/* Alignment Group */}
                  <div className="flex items-center mr-2">
                    {alignmentCommands.map((cmd) => (
                      <Tooltip key={cmd.command}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => executeCommand(cmd.command)}
                          >
                            {cmd.icon}
                            <span className="sr-only">{cmd.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{cmd.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>

                  <Separator orientation="vertical" className="h-8 mx-1" />

                  {/* Other Commands */}
                  <div className="flex items-center">
                    {otherCommands.map((cmd) => (
                      <Tooltip key={cmd.command}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSpecialCommand(cmd.command)}
                          >
                            {cmd.icon}
                            <span className="sr-only">{cmd.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{cmd.label}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>

              {/* Editable Content Area */}
              <div
                ref={editorRef}
                className="min-h-[200px] p-3 focus:outline-none"
                contentEditable
                dangerouslySetInnerHTML={{ __html: description }}
                onInput={(e) => setDescription(e.currentTarget.innerHTML)}
                onBlur={(e) => setDescription(e.currentTarget.innerHTML)}
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="123-456-7890"
                className="pl-9 h-14 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter a phone number in the format: 123-456-7890</p>
          </div>

          {/* IBAN Field */}
          <div className="space-y-2">
            <Label htmlFor="iban" className="text-base font-medium">
              Bank Account (IBAN)
            </Label>
            <div className="relative">
              <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="iban"
                value={iban}
                onChange={handleIbanChange}
                placeholder="DE89 3704 0044 0532 0130 00"
                className="pl-9 h-14 text-base font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter an IBAN with spaces between each 4 characters</p>
          </div>

          {/* Read-only Field */}
          <div className="space-y-2">
            <Label htmlFor="readonly" className="text-base font-medium flex items-center gap-2">
              System Reference ID
              <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Input
              id="readonly"
              value="REF-2025-05-22-4392"
              readOnly
              className="h-14 text-base bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">This field is auto-generated and cannot be modified</p>
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="h-14 text-base">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords Field (List type with Tab separation) */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-base font-medium">
              Keywords
            </Label>
            <div className="border rounded-md p-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      <span className="sr-only">Remove {keyword}</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="keywords"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordInputKeyDown}
                  placeholder="Type a keyword and press Tab or Enter to add"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Tab or Enter after each keyword to add it to the list
              </p>
            </div>
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base font-medium">
              Tags
            </Label>

            {/* Search input for tags */}
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            {/* Scrollable container for tags */}
            <div className="border rounded-md">
              <div className="max-h-[240px] overflow-y-auto p-3" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {displayedTags.length > 0 ? (
                    displayedTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-base font-normal cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4 text-muted-foreground">No tags match your search</div>
                  )}
                </div>
              </div>

              {filteredTags.length > initialTagsCount && !tagSearchQuery && (
                <div className="p-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-sm flex items-center justify-center"
                    onClick={() => setShowAllTags(!showAllTags)}
                  >
                    {showAllTags ? (
                      <>
                        <ChevronUpIcon className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-4 w-4 mr-1" />
                        Show More ({filteredTags.length - initialTagsCount} more)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-base font-medium">
              Attachments
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG (max 10MB each)</p>
              </div>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      {file.type.startsWith("image/") && file.preview ? (
                        <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            className="h-full w-full object-cover"
                            onLoad={() => {
                              URL.revokeObjectURL(file.preview!)
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-background flex items-center justify-center flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Remove {file.name}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boolean Fields */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Options</Label>
            <div className="border rounded-md p-3 space-y-3">
              {booleanOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between">
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                  <Switch
                    id={option.id}
                    checked={booleanValues[option.id]}
                    onCheckedChange={() => handleBooleanToggle(option.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Date and Time Field */}
          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="text-base font-medium">
              Expiry Date and Time
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expiry-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 text-base",
                      !expiryDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>

              <Select value={expiryTime} onValueChange={setExpiryTime}>
                <SelectTrigger className="h-14 text-base w-[140px]">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-8 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit">Create Post</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
