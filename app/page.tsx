"use client"

import { useState, useEffect } from "react"
import { PlusIcon, SearchIcon, FilterIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreatePostModal } from "@/components/create-post-modal"
import { FilterPanel } from "@/components/filter-panel"
import { PostListItem } from "@/components/post-list-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for demonstration (same as before, but with isPaywalled property added)
const samplePosts = [
  {
    id: "1",
    title: "Looking for a technology partner for EU project",
    category: "Partner Hunt",
    author: {
      id: "a1",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Tech Solutions Inc.",
      sector: "Information Technology",
    },
    createdAt: new Date(2023, 4, 15),
    expiresAt: new Date(2023, 6, 15),
    description:
      "We are looking for a technology partner with expertise in AI and machine learning for an upcoming EU-funded project. The project aims to develop innovative solutions for smart cities. Ideal partners would have previous experience with EU projects and a strong background in AI research and development. The project is expected to start in September 2023 and run for 36 months.",
    tags: ["AI", "Machine Learning", "EU Project", "Smart Cities", "Technology"],
    attachments: [
      {
        name: "Project_Brief.pdf",
        type: "pdf",
        url: "#",
      },
      {
        name: "Technical_Requirements.docx",
        type: "docx",
        url: "#",
      },
    ],
    likes: 24,
    isPaywalled: false,
    comments: [
      {
        id: "c1",
        author: {
          id: "u2",
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "This sounds like an interesting project. Our company has experience with similar EU initiatives. Would love to discuss further.",
        createdAt: new Date(2023, 4, 16),
        likes: 3,
        replies: [
          {
            id: "r1",
            author: {
              id: "a1",
              name: "Jane Smith",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Thanks for your interest! Please feel free to contact me directly to discuss the details.",
            createdAt: new Date(2023, 4, 17),
            likes: 1,
          },
        ],
      },
      {
        id: "c2",
        author: {
          id: "u3",
          name: "Alice Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: "What's the expected budget for this project?",
        createdAt: new Date(2023, 4, 18),
        likes: 2,
      },
    ],
  },
  {
    id: "2",
    title: "Seeking academic partners for Horizon Europe proposal",
    category: "Research",
    author: {
      id: "a2",
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "University of Innovation",
      sector: "Higher Education",
    },
    createdAt: new Date(2023, 4, 10),
    expiresAt: new Date(2023, 5, 25),
    description:
      "Our research group is preparing a Horizon Europe proposal in the field of renewable energy and is looking for academic partners with expertise in solar panel efficiency and energy storage solutions. We already have industrial partners but need academic institutions to strengthen our consortium.",
    tags: ["Horizon Europe", "Renewable Energy", "Academic", "Research", "Solar Energy"],
    likes: 18,
    isPaywalled: true,
    comments: [
      {
        id: "c3",
        author: {
          id: "u4",
          name: "Maria Garcia",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content:
          "Our department at Barcelona Tech has been working on advanced energy storage solutions for the past 5 years. Would be interested in joining your consortium.",
        createdAt: new Date(2023, 4, 12),
        likes: 4,
      },
    ],
  },
  {
    id: "3",
    title: "SME partner needed for Digital Europe Programme",
    category: "Open Positions",
    author: {
      id: "a3",
      name: "Thomas Weber",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Digital Solutions GmbH",
      sector: "Digital Services",
    },
    createdAt: new Date(2023, 4, 5),
    expiresAt: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    description:
      "We are looking for SME partners for a Digital Europe Programme proposal focused on cybersecurity solutions for critical infrastructure. Ideal partners would have experience in network security, threat detection, or related fields.",
    tags: ["Digital Europe", "Cybersecurity", "SME", "Critical Infrastructure", "Network Security"],
    likes: 15,
    isPaywalled: false,
    comments: [],
  },
  {
    id: "4",
    title: "Workshop on AI Ethics and Governance",
    category: "Events",
    author: {
      id: "a4",
      name: "Elena Petrova",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "European AI Alliance",
      sector: "Non-profit",
    },
    createdAt: new Date(2023, 4, 20),
    expiresAt: new Date(2023, 7, 15),
    description:
      "We are organizing a two-day workshop on AI Ethics and Governance in Brussels. The workshop will bring together policymakers, researchers, and industry representatives to discuss the ethical implications of AI and develop governance frameworks. Registration is now open.",
    tags: ["AI Ethics", "Workshop", "Governance", "Policy", "Brussels"],
    likes: 32,
    isPaywalled: true,
    comments: [],
  },
  {
    id: "5",
    title: "Offering expertise in sustainable agriculture technologies",
    category: "Expertise",
    author: {
      id: "a5",
      name: "Marco Rossi",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "AgriTech Solutions",
      sector: "Agriculture",
    },
    createdAt: new Date(2023, 4, 18),
    expiresAt: new Date(2023, 8, 18),
    description:
      "Our team offers expertise in sustainable agriculture technologies, including precision farming, IoT sensors for crop monitoring, and AI-based yield prediction. We are looking to join consortia for Horizon Europe projects in the food security and sustainable agriculture domains.",
    tags: ["Agriculture", "Sustainability", "IoT", "Precision Farming", "Food Security"],
    likes: 27,
    isPaywalled: false,
    comments: [],
  },
  {
    id: "6",
    title: "Collaborative project on urban mobility solutions",
    category: "Projects",
    author: {
      id: "a6",
      name: "Sophie Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      affiliation: "Urban Mobility Lab",
      sector: "Transportation",
    },
    createdAt: new Date(2023, 4, 25),
    expiresAt: new Date(2023, 7, 25),
    description:
      "We are initiating a collaborative project on innovative urban mobility solutions focusing on reducing carbon emissions and improving public transportation efficiency. We are looking for partners with expertise in transportation planning, smart city technologies, and sustainable mobility.",
    tags: ["Urban Mobility", "Smart Cities", "Sustainability", "Transportation", "Carbon Reduction"],
    likes: 19,
    isPaywalled: true,
    comments: [],
  },
]

export default function PostExplorationPage() {
  const [posts, setPosts] = useState(samplePosts)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredPosts, setFilteredPosts] = useState(samplePosts)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isPaywalled, setIsPaywalled] = useState<boolean | null>(null)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Saved search states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedState, setLastSavedState] = useState<any>(null)

  // Filter posts based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
  }

  // Handle sector changes
  const handleSectorChange = (sector: string, checked: boolean) => {
    if (checked) {
      setSelectedSectors((prev) => [...prev, sector])
    } else {
      setSelectedSectors((prev) => prev.filter((s) => s !== sector))
    }
    setHasUnsavedChanges(true)
  }

  // Handle tag changes
  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags((prev) => [...prev, tag])
    } else {
      setSelectedTags((prev) => prev.filter((t) => t !== tag))
    }
    setHasUnsavedChanges(true)
  }

  // Handle paywall filter changes
  const handlePaywallChange = (value: boolean | null) => {
    setIsPaywalled(value)
    setHasUnsavedChanges(true)
  }

  // Handle date changes
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    setHasUnsavedChanges(true)
  }

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date)
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(false)
  }

  // Load saved search
  const handleLoadSavedSearch = (search: any) => {
    setSearchQuery(search.searchQuery)
    setSelectedCategories(search.selectedCategories)
    setSelectedSectors(search.selectedSectors)
    setSelectedTags(search.selectedTags)
    setIsPaywalled(search.isPaywalled)
    setDateFrom(search.dateFrom)
    setDateTo(search.dateTo)
    setLastSavedState(search)
    setHasUnsavedChanges(false)
  }

  // Mark as saved
  const handleMarkAsSaved = () => {
    setHasUnsavedChanges(false)
    setLastSavedState({
      searchQuery,
      selectedCategories,
      selectedSectors,
      selectedTags,
      isPaywalled,
      dateFrom,
      dateTo,
    })
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
      <FilterPanel
        onFilterChange={setFilteredPosts}
        posts={posts}
        selectedCategories={selectedCategories}
        selectedSectors={selectedSectors}
        selectedTags={selectedTags}
        isPaywalled={isPaywalled}
        dateFrom={dateFrom}
        dateTo={dateTo}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSectorChange={handleSectorChange}
        onTagChange={handleTagChange}
        onPaywallChange={handlePaywallChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onResetFilters={resetFilters}
        onLoadSavedSearch={handleLoadSavedSearch}
        hasUnsavedChanges={hasUnsavedChanges}
        onMarkAsSaved={handleMarkAsSaved}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Explore Posts</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FilterIcon className="h-4 w-4" />
              <span>"{filteredPosts.length}" posts found...</span>
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
                <SelectItem value="relevant">Relevant</SelectItem>
              </SelectContent>
            </Select>
            <Button className="rounded-full" size="icon" onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="h-5 w-5" />
              <span className="sr-only">Create Post</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts, authors, tags..."
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
              <p className="text-muted-foreground">No posts found matching your criteria.</p>
            </div>
          )}
        </div>

        <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  )
}
