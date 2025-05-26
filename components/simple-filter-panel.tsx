"use client"

import { useState, useEffect } from "react"
import {
  RotateCcwIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  CalendarIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { SavedSearchManager } from "@/components/saved-search-manager"

interface SimpleFilterPanelProps {
  onFilterChange: (filteredPosts: any[]) => void
  posts: any[]
  selectedCategories: string[]
  selectedSectors: string[]
  selectedTags: string[]
  isPaywalled: boolean | null
  dateFrom: Date | undefined
  dateTo: Date | undefined
  onCategoryChange: (category: string, checked: boolean) => void
  onSectorChange: (sector: string, checked: boolean) => void
  onTagChange: (tag: string, checked: boolean) => void
  onPaywallChange: (value: boolean | null) => void
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
  onResetFilters: () => void
  // Add these new props for saved search functionality
  searchQuery?: string
  hasUnsavedChanges?: boolean
  onLoadSearch?: (search: any) => void
  onMarkAsSaved?: () => void
}

const categories = ["Events", "Expertise", "Open Positions", "Partner Hunt", "Projects", "Research", "Other"]

const sectors = [
  "Information Technology",
  "Higher Education",
  "Digital Services",
  "Non-profit",
  "Agriculture",
  "Transportation",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Energy",
]

const tags = [
  "AI",
  "Machine Learning",
  "EU Project",
  "Smart Cities",
  "Technology",
  "Horizon Europe",
  "Renewable Energy",
  "Academic",
  "Research",
  "Solar Energy",
  "Digital Europe",
  "Cybersecurity",
  "SME",
  "Critical Infrastructure",
  "Network Security",
]

export function SimpleFilterPanel({
  onFilterChange,
  posts,
  selectedCategories,
  selectedSectors,
  selectedTags,
  isPaywalled,
  dateFrom,
  dateTo,
  onCategoryChange,
  onSectorChange,
  onTagChange,
  onPaywallChange,
  onDateFromChange,
  onDateToChange,
  onResetFilters,
  searchQuery = "",
  hasUnsavedChanges = false,
  onLoadSearch = () => {},
  onMarkAsSaved = () => {},
}: SimpleFilterPanelProps) {
  const [categorySearch, setCategorySearch] = useState("")
  const [sectorSearch, setSectorSearch] = useState("")
  const [tagSearch, setTagSearch] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    mainCategory: true,
    subCategory: true,
    itemType: true,
    publicationType: true,
    language: true,
    govFunding: true,
    govSource: true,
    peerReviewed: true,
    paywall: true,
    date: true,
  })
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllSectors, setShowAllSectors] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  const initialCount = 5

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  const filteredSectors = sectors.filter((sector) => sector.toLowerCase().includes(sectorSearch.toLowerCase()))

  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))

  const displayedCategories = showAllCategories ? filteredCategories : filteredCategories.slice(0, initialCount)
  const displayedSectors = showAllSectors ? filteredSectors : filteredSectors.slice(0, initialCount)
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, initialCount)

  useEffect(() => {
    let filtered = [...posts]

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((post) => selectedCategories.includes(post.category))
    }

    if (selectedSectors.length > 0) {
      filtered = filtered.filter((post) => selectedSectors.includes(post.author.sector))
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) => post.tags.some((tag) => selectedTags.includes(tag)))
    }

    if (isPaywalled !== null) {
      filtered = filtered.filter((post) => post.isPaywalled === isPaywalled)
    }

    if (dateFrom) {
      filtered = filtered.filter((post) => new Date(post.createdAt) >= dateFrom)
    }

    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      filtered = filtered.filter((post) => new Date(post.createdAt) < endDate)
    }

    onFilterChange(filtered)
  }, [selectedCategories, selectedSectors, selectedTags, isPaywalled, dateFrom, dateTo, posts, onFilterChange])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <h2 className="font-medium">Filter By</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcwIcon className="h-3 w-3 mr-1" />
          Reset All
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* Saved Search Manager */}
      <SavedSearchManager
        currentSearch={{
          searchQuery,
          selectedCategories,
          selectedSectors,
          selectedTags,
          isPaywalled,
          dateFrom,
          dateTo,
        }}
        onLoadSearch={onLoadSearch}
        hasUnsavedChanges={hasUnsavedChanges}
        onMarkAsSaved={onMarkAsSaved}
      />

      <Separator className="mb-4" />

      {/* Main Category Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("mainCategory")}
        >
          <Label className="text-sm font-medium">Main Category</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.mainCategory ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.mainCategory && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {[
              "Deconstructing China",
              "Environment and Climate",
              "Global China",
              "Political Economy",
              "Science and Technology",
              "Security",
            ].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`main-category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={`main-category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Sub Category Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("subCategory")}
        >
          <Label className="text-sm font-medium">Sub Category</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.subCategory ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.subCategory && (
          <>
            <div className="relative mb-2">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sub categories..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-7 pr-8 h-8 text-xs"
              />
              {tagSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setTagSearch("")}
                >
                  <XIcon className="h-3 w-3" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
              {[
                "Political relations",
                "National Territorial and Maritime Security",
                "ICT and Telecom",
                "Climate Change",
                "Foreign Policy Decision Making",
                "Monetary Policy",
                "Global Governance Structures",
                "Tech Manufacturing",
                "Environmental Pollution and Health",
                "Chinese Communist Party",
                "Fiscal Policy",
                "Norms and values",
                "Military Modernization",
                "Green Tech",
                "Conservation and Biodiversity",
                "Local and Provincial Governments",
                "International Financial Flows",
                "Economic relations",
                "Military Power Projection",
                "Outer Space",
                "Sustainable Development",
                "Society",
                "Trade",
                "Intelligence and Hybrid Security",
                "Tech Policies",
                "Resource Management",
                "National Government",
                "Protection of Chinese Interest Overseas",
                "Transportation",
                "China's Environmental Governance System",
                "Marine Technology",
                "China's Environmental Impact on the World",
                "Biotech",
              ]
                .filter((subCat) => subCat.toLowerCase().includes(tagSearch.toLowerCase()))
                .slice(0, showAllTags ? undefined : 5)
                .map((subCategory) => (
                  <div key={subCategory} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-category-${subCategory}`}
                      checked={selectedTags.includes(subCategory)}
                      onCheckedChange={(checked) => onTagChange(subCategory, checked as boolean)}
                    />
                    <Label htmlFor={`sub-category-${subCategory}`} className="text-sm cursor-pointer">
                      {subCategory}
                    </Label>
                  </div>
                ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags
                ? "Show Less"
                : `Show ${filteredTags.filter((subCat) => subCat.toLowerCase().includes(tagSearch.toLowerCase())).length - 5} More`}
            </Button>
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Item Type Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("itemType")}
        >
          <Label className="text-sm font-medium">Item Type</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.itemType ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.itemType && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {[
              "Datasets",
              "News",
              "Press Release and Statements",
              "Projects",
              "Publications",
              "Regulations and Policies",
            ].map((itemType) => (
              <div key={itemType} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-type-${itemType}`}
                  checked={selectedSectors.includes(itemType)}
                  onCheckedChange={(checked) => onSectorChange(itemType, checked as boolean)}
                />
                <Label htmlFor={`item-type-${itemType}`} className="text-sm cursor-pointer">
                  {itemType}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Publication Type Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("publicationType")}
        >
          <Label className="text-sm font-medium">Publication Type</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.publicationType ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.publicationType && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["Academic Article", "Report", "Book or Chapter"].map((pubType) => (
              <div key={pubType} className="flex items-center space-x-2">
                <Checkbox
                  id={`pub-type-${pubType}`}
                  // Using a new state for publication type - you'll need to add this to the component props
                  checked={false}
                  onCheckedChange={(checked) => {
                    /* Add handler */
                  }}
                />
                <Label htmlFor={`pub-type-${pubType}`} className="text-sm cursor-pointer">
                  {pubType}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Language Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("language")}
        >
          <Label className="text-sm font-medium">Language</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.language ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.language && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["English", "Mandarin"].map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  // Using a new state for language - you'll need to add this to the component props
                  checked={false}
                  onCheckedChange={(checked) => {
                    /* Add handler */
                  }}
                />
                <Label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Government Funding Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("govFunding")}
        >
          <Label className="text-sm font-medium">Government Funding</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.govFunding ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.govFunding && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["No", "Not Specified", "Yes"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`gov-funding-${option}`}
                  // Using a new state for government funding - you'll need to add this to the component props
                  checked={false}
                  onCheckedChange={(checked) => {
                    /* Add handler */
                  }}
                />
                <Label htmlFor={`gov-funding-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Government Source Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("govSource")}
        >
          <Label className="text-sm font-medium">Government Source</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.govSource ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.govSource && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["No", "Not Specified", "Yes"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`gov-source-${option}`}
                  // Using a new state for government source - you'll need to add this to the component props
                  checked={false}
                  onCheckedChange={(checked) => {
                    /* Add handler */
                  }}
                />
                <Label htmlFor={`gov-source-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Peer-Reviewed Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("peerReviewed")}
        >
          <Label className="text-sm font-medium">Peer-Reviewed</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.peerReviewed ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.peerReviewed && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["No", "Not Specified", "Yes"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`peer-reviewed-${option}`}
                  // Using a new state for peer reviewed - you'll need to add this to the component props
                  checked={false}
                  onCheckedChange={(checked) => {
                    /* Add handler */
                  }}
                />
                <Label htmlFor={`peer-reviewed-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Paywall Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("paywall")}>
          <Label className="text-sm font-medium">Paywalled</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.paywall ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>

        {expandedSections.paywall && (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
            {["Yes", "No"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`paywall-${option}`}
                  checked={option === "Yes" ? isPaywalled === true : option === "No" ? isPaywalled === false : false}
                  onCheckedChange={(checked) => {
                    if (option === "Yes") {
                      onPaywallChange(checked ? true : null)
                    } else if (option === "No") {
                      onPaywallChange(checked ? false : null)
                    }
                  }}
                />
                <Label htmlFor={`paywall-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Publication Date Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("date")}>
          <Label className="text-sm font-medium">Publication Date</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.date ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>

        {expandedSections.date && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-xs">
                From
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    className={cn("w-full justify-start text-left text-xs h-8", !dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-xs">
                To
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    className={cn("w-full justify-start text-left text-xs h-8", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={onDateToChange}
                    initialFocus
                    disabled={(date) => (dateFrom ? date < dateFrom : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => {
                  onDateFromChange(undefined)
                  onDateToChange(undefined)
                }}
              >
                Clear Dates
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
