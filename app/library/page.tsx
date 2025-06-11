"use client"

import { useState, useEffect } from "react"
import { PlusIcon, SearchIcon, FilterIcon, XIcon, BookOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreatePostModal } from "@/components/create-post-modal"
import { SimpleFilterPanel } from "@/components/simple-filter-panel"
import { PostListItem } from "@/components/post-list-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample library data
const sampleLibraryPosts = [
  {
    id: "lib1",
    title: "Comprehensive Guide to EU Funding Programs 2024",
    category: "Research",
    author: {
      id: "a1",
      name: "Dr. Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "European Research Council",
      sector: "Higher Education",
    },
    createdAt: new Date(2024, 0, 15),
    expiresAt: new Date(2025, 0, 15),
    description:
      "A comprehensive guide covering all major EU funding programs including Horizon Europe, Digital Europe Programme, and LIFE Programme. This document provides detailed information on application procedures, eligibility criteria, and success strategies for securing EU funding.",
    tags: ["EU Funding", "Horizon Europe", "Research", "Grant Writing", "Policy"],
    attachments: [
      {
        name: "EU_Funding_Guide_2024.pdf",
        type: "pdf",
        url: "#",
      },
    ],
    likes: 156,
    isPaywalled: false,
    comments: [
      {
        id: "c1",
        author: {
          id: "u2",
          name: "Prof. Michael Chen",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Excellent resource! This guide helped our university secure three major grants this year.",
        createdAt: new Date(2024, 0, 20),
        likes: 12,
      },
    ],
  },
  {
    id: "lib2",
    title: "AI Ethics Framework for European Organizations",
    category: "Expertise",
    author: {
      id: "a2",
      name: "Dr. Sarah Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "AI Ethics Institute",
      sector: "Non-profit",
    },
    createdAt: new Date(2024, 1, 10),
    expiresAt: new Date(2025, 1, 10),
    description:
      "A practical framework for implementing AI ethics in European organizations, covering GDPR compliance, algorithmic transparency, and responsible AI development practices. Includes case studies and implementation templates.",
    tags: ["AI Ethics", "GDPR", "Compliance", "Framework", "Best Practices"],
    likes: 89,
    isPaywalled: true,
    comments: [],
  },
  {
    id: "lib3",
    title: "Sustainable Technology Innovation Handbook",
    category: "Projects",
    author: {
      id: "a3",
      name: "Dr. Lars Andersen",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Green Tech Alliance",
      sector: "Energy",
    },
    createdAt: new Date(2024, 2, 5),
    expiresAt: new Date(2025, 2, 5),
    description:
      "Comprehensive handbook covering sustainable technology innovations, renewable energy solutions, and green technology implementation strategies. Features real-world case studies from successful European green tech projects.",
    tags: ["Sustainability", "Green Technology", "Renewable Energy", "Innovation", "Climate"],
    likes: 134,
    isPaywalled: false,
    comments: [
      {
        id: "c2",
        author: {
          id: "u3",
          name: "Maria Gonzalez",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "This handbook is a goldmine of information for anyone working in sustainable technology.",
        createdAt: new Date(2024, 2, 8),
        likes: 8,
      },
    ],
  },
  {
    id: "lib4",
    title: "Digital Transformation Best Practices for SMEs",
    category: "Expertise",
    author: {
      id: "a4",
      name: "Thomas Weber",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Digital Innovation Hub",
      sector: "Digital Services",
    },
    createdAt: new Date(2024, 3, 12),
    expiresAt: new Date(2025, 3, 12),
    description:
      "A practical guide for small and medium enterprises looking to undergo digital transformation. Covers technology adoption strategies, change management, and digital skills development.",
    tags: ["Digital Transformation", "SME", "Technology Adoption", "Change Management", "Skills"],
    likes: 67,
    isPaywalled: true,
    comments: [],
  },
  {
    id: "lib5",
    title: "Cybersecurity Framework for Critical Infrastructure",
    category: "Research",
    author: {
      id: "a5",
      name: "Dr. Anna Kowalski",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Cybersecurity Research Institute",
      sector: "Information Technology",
    },
    createdAt: new Date(2024, 4, 8),
    expiresAt: new Date(2025, 4, 8),
    description:
      "Comprehensive cybersecurity framework designed specifically for protecting critical infrastructure in Europe. Includes threat assessment methodologies, incident response procedures, and compliance guidelines.",
    tags: ["Cybersecurity", "Critical Infrastructure", "Threat Assessment", "Compliance", "Security"],
    likes: 98,
    isPaywalled: false,
    comments: [
      {
        id: "c3",
        author: {
          id: "u4",
          name: "Robert Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "Essential reading for anyone involved in infrastructure security. Very comprehensive approach.",
        createdAt: new Date(2024, 4, 15),
        likes: 5,
      },
    ],
  },
]

export default function LibraryPage() {
  const [posts, setPosts] = useState(sampleLibraryPosts)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredPosts, setFilteredPosts] = useState(sampleLibraryPosts)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPaywalled, setIsPaywalled] = useState<boolean | null>(null)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Filter posts based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(query)
  }

  // Apply all filters
  const applyFilters = (query = searchQuery) => {
    let filtered = [...posts]

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          post.author.name.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((post) => selectedCategories.includes(post.category))
    }

    // Sector filter
    if (selectedSectors.length > 0) {
      filtered = filtered.filter((post) => selectedSectors.includes(post.author.sector))
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) => post.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Paywall filter
    if (isPaywalled !== null) {
      filtered = filtered.filter((post) => post.isPaywalled === isPaywalled)
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((post) => new Date(post.createdAt) >= dateFrom)
    }

    if (dateTo) {
      // Add one day to include the end date fully
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      filtered = filtered.filter((post) => new Date(post.createdAt) < endDate)
    }

    setFilteredPosts(filtered)
  }

  // Handle category changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  // Handle sector changes
  const handleSectorChange = (sector: string, checked: boolean) => {
    if (checked) {
      setSelectedSectors((prev) => [...prev, sector])
    } else {
      setSelectedSectors((prev) => prev.filter((s) => s !== sector))
    }
  }

  // Handle tag changes
  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags((prev) => [...prev, tag])
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag))
    }
  }

  // Handle paywall filter changes
  const handlePaywallChange = (value: boolean | null) => {
    setIsPaywalled(value)
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedSectors([])
    setSelectedTags([])
    setIsPaywalled(null)
    setDateFrom(undefined)
    setDateTo(undefined)
    setSearchQuery("")
    setFilteredPosts(posts)
  }

  // Update filters when any filter state changes
  useEffect(() => {
    applyFilters()
  }, [selectedCategories, selectedSectors, selectedTags, isPaywalled, dateFrom, dateTo])

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime()
      case "relevant":
        return b.likes - a.likes
      default:
        return 0
    }
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Filter Panel */}
      <SimpleFilterPanel
        onFilterChange={setFilteredPosts}
        posts={posts}
        selectedCategories={selectedCategories}
        selectedSectors={selectedSectors}
        selectedTags={selectedTags}
        isPaywalled={isPaywalled}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onCategoryChange={handleCategoryChange}
        onSectorChange={handleSectorChange}
        onTagChange={handleTagChange}
        onPaywallChange={handlePaywallChange}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onResetFilters={resetFilters}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Online Dynamic Library</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FilterIcon className="h-4 w-4" />
              <span>"{filteredPosts.length}" resources found...</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="relevant">Most Liked</SelectItem>
              </SelectContent>
            </Select>
            <Button className="rounded-full" size="icon" onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Add Resource</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources, authors, topics..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-10 h-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleSearch("")}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => <PostListItem key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </div>
          )}
        </div>

        <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  )
}
