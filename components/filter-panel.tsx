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
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface FilterPanelProps {
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
  "Telecommunications",
  "Retail",
  "Media",
  "Construction",
  "Hospitality",
  "Real Estate",
  "Legal Services",
  "Consulting",
  "Aerospace",
  "Automotive",
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
  "AI Ethics",
  "Workshop",
  "Governance",
  "Policy",
  "Brussels",
  "Agriculture",
  "Sustainability",
  "IoT",
  "Precision Farming",
  "Food Security",
  "Urban Mobility",
  "Transportation",
  "Carbon Reduction",
]

export function FilterPanel({
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
}: FilterPanelProps) {
  const [categorySearch, setCategorySearch] = useState("")
  const [sectorSearch, setSectorSearch] = useState("")
  const [tagSearch, setTagSearch] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sectors: true,
    tags: true,
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

      {/* Selected Filters Section */}
      {(selectedCategories.length > 0 ||
        selectedSectors.length > 0 ||
        selectedTags.length > 0 ||
        isPaywalled !== null ||
        dateFrom ||
        dateTo) && (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-3">Selected Filters</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={`category-${category}`}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-2 py-1 h-7 text-xs"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-blue-700 hover:text-blue-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCategoryChange(category, false)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove {category} filter</span>
                  </Button>
                </Badge>
              ))}

              {selectedSectors.map((sector) => (
                <Badge
                  key={`sector-${sector}`}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-2 py-1 h-7 text-xs"
                >
                  {sector}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-green-700 hover:text-green-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSectorChange(sector, false)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove {sector} filter</span>
                  </Button>
                </Badge>
              ))}

              {selectedTags.map((tag) => (
                <Badge
                  key={`tag-${tag}`}
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 px-2 py-1 h-7 text-xs"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-purple-700 hover:text-purple-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagChange(tag, false)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove {tag} filter</span>
                  </Button>
                </Badge>
              ))}

              {isPaywalled !== null && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 px-2 py-1 h-7 text-xs"
                >
                  {isPaywalled ? "Paywalled" : "Free Access"}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-amber-700 hover:text-amber-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPaywallChange(null)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove paywall filter</span>
                  </Button>
                </Badge>
              )}

              {dateFrom && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 px-2 py-1 h-7 text-xs"
                >
                  From: {format(dateFrom, "MMM d, yyyy")}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-gray-700 hover:text-gray-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDateFromChange(undefined)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove date from filter</span>
                  </Button>
                </Badge>
              )}

              {dateTo && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 px-2 py-1 h-7 text-xs"
                >
                  To: {format(dateTo, "MMM d, yyyy")}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0 text-gray-700 hover:text-gray-900 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDateToChange(undefined)
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove date to filter</span>
                  </Button>
                </Badge>
              )}
            </div>
          </div>
          <Separator className="mb-4" />
        </>
      )}

      {/* Categories Filter */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => toggleSection("categories")}
        >
          <Label className="text-sm font-medium">Categories</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.categories ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {expandedSections.categories && (
          <>
            {filteredCategories.length > 5 && (
              <div className="relative mb-2">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-7 pr-8 h-8 text-xs"
                />
                {categorySearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setCategorySearch("")}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
              {displayedCategories.length > 0 ? (
                displayedCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No categories match your search</p>
              )}
            </div>

            {filteredCategories.length > initialCount && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "Show Less" : `Show ${filteredCategories.length - initialCount} More`}
              </Button>
            )}
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Sectors Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("sectors")}>
          <Label className="text-sm font-medium">Sectors</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.sectors ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>

        {expandedSections.sectors && (
          <>
            {filteredSectors.length > 5 && (
              <div className="relative mb-2">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search sectors..."
                  value={sectorSearch}
                  onChange={(e) => setSectorSearch(e.target.value)}
                  className="pl-7 pr-8 h-8 text-xs"
                />
                {sectorSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setSectorSearch("")}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
              {displayedSectors.length > 0 ? (
                displayedSectors.map((sector) => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sector-${sector}`}
                      checked={selectedSectors.includes(sector)}
                      onCheckedChange={(checked) => onSectorChange(sector, checked as boolean)}
                    />
                    <Label htmlFor={`sector-${sector}`} className="text-sm cursor-pointer">
                      {sector}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No sectors match your search</p>
              )}
            </div>

            {filteredSectors.length > initialCount && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => setShowAllSectors(!showAllSectors)}
              >
                {showAllSectors ? "Show Less" : `Show ${filteredSectors.length - initialCount} More`}
              </Button>
            )}
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Tags Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("tags")}>
          <Label className="text-sm font-medium">Tags</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.tags ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>

        {expandedSections.tags && (
          <>
            {filteredTags.length > 5 && (
              <div className="relative mb-2">
                <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tags..."
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
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-2">
              {displayedTags.length > 0 ? (
                displayedTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => onTagChange(tag, checked as boolean)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No tags match your search</p>
              )}
            </div>

            {filteredTags.length > initialCount && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "Show Less" : `Show ${filteredTags.length - initialCount} More`}
              </Button>
            )}
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Paywall Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("paywall")}>
          <Label className="text-sm font-medium">Access Type</Label>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {expandedSections.paywall ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>

        {expandedSections.paywall && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="free-access" className="text-sm cursor-pointer">
                Free Access Only
              </Label>
              <Switch
                id="free-access"
                checked={isPaywalled === false}
                onCheckedChange={(checked) => onPaywallChange(checked ? false : null)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="paywalled" className="text-sm cursor-pointer">
                Paywalled Only
              </Label>
              <Switch
                id="paywalled"
                checked={isPaywalled === true}
                onCheckedChange={(checked) => onPaywallChange(checked ? true : null)}
              />
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Date Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => toggleSection("date")}>
          <Label className="text-sm font-medium">Date Range</Label>
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
