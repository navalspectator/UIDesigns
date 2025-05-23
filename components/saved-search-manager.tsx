"use client"

import { useState, useEffect } from "react"
import {
  SaveIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
  BookmarkIcon,
  AlertTriangleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface SavedSearch {
  id: string
  name: string
  searchQuery: string
  selectedCategories: string[]
  selectedSectors: string[]
  selectedTags: string[]
  isPaywalled: boolean | null
  dateFrom: Date | undefined
  dateTo: Date | undefined
  createdAt: Date
}

interface SavedSearchManagerProps {
  currentSearch: {
    searchQuery: string
    selectedCategories: string[]
    selectedSectors: string[]
    selectedTags: string[]
    isPaywalled: boolean | null
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }
  onLoadSearch: (search: SavedSearch) => void
  hasUnsavedChanges: boolean
  onMarkAsSaved: () => void
}

export function SavedSearchManager({
  currentSearch,
  onLoadSearch,
  hasUnsavedChanges,
  onMarkAsSaved,
}: SavedSearchManagerProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null)
  const [saveSearchName, setSaveSearchName] = useState("")
  const [isOverwrite, setIsOverwrite] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches")
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((search: any) => ({
          ...search,
          dateFrom: search.dateFrom ? new Date(search.dateFrom) : undefined,
          dateTo: search.dateTo ? new Date(search.dateTo) : undefined,
          createdAt: new Date(search.createdAt),
        }))
        setSavedSearches(parsed)
      } catch (error) {
        console.error("Failed to load saved searches:", error)
      }
    }
  }, [])

  // Save to localStorage whenever savedSearches changes
  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
  }, [savedSearches])

  // Check if current search matches any saved search
  const getCurrentSearchMatch = () => {
    return savedSearches.find((search) => {
      return (
        search.searchQuery === currentSearch.searchQuery &&
        JSON.stringify(search.selectedCategories.sort()) === JSON.stringify(currentSearch.selectedCategories.sort()) &&
        JSON.stringify(search.selectedSectors.sort()) === JSON.stringify(currentSearch.selectedSectors.sort()) &&
        JSON.stringify(search.selectedTags.sort()) === JSON.stringify(currentSearch.selectedTags.sort()) &&
        search.isPaywalled === currentSearch.isPaywalled &&
        search.dateFrom?.getTime() === currentSearch.dateFrom?.getTime() &&
        search.dateTo?.getTime() === currentSearch.dateTo?.getTime()
      )
    })
  }

  const activeSearch = activeSearchId ? savedSearches.find((s) => s.id === activeSearchId) : null

  const handleSaveSearch = () => {
    if (!saveSearchName.trim()) return

    const newSearch: SavedSearch = {
      id: isOverwrite && editingSearch ? editingSearch.id : crypto.randomUUID(),
      name: saveSearchName.trim(),
      ...currentSearch,
      createdAt: new Date(),
    }

    if (isOverwrite && editingSearch) {
      setSavedSearches((prev) => prev.map((search) => (search.id === editingSearch.id ? newSearch : search)))
    } else {
      setSavedSearches((prev) => [...prev, newSearch])
    }

    setActiveSearchId(newSearch.id)
    onMarkAsSaved()
    setShowSaveModal(false)
    setSaveSearchName("")
    setEditingSearch(null)
    setIsOverwrite(false)
  }

  const handleDeleteSearch = () => {
    if (!searchToDelete) return

    setSavedSearches((prev) => prev.filter((search) => search.id !== searchToDelete.id))
    if (activeSearchId === searchToDelete.id) {
      setActiveSearchId(null)
    }
    setShowDeleteModal(false)
    setSearchToDelete(null)
  }

  const handleLoadSearch = (search: SavedSearch) => {
    const executeLoad = () => {
      onLoadSearch(search)
      setActiveSearchId(search.id)
      onMarkAsSaved()
    }

    if (hasUnsavedChanges) {
      setPendingAction(() => executeLoad)
      setShowUnsavedModal(true)
    } else {
      executeLoad()
    }
  }

  const handleEditSearch = (search: SavedSearch) => {
    setEditingSearch(search)
    setSaveSearchName(search.name)
    setIsOverwrite(true)
    setShowSaveModal(true)
  }

  const handleDeleteClick = (search: SavedSearch) => {
    setSearchToDelete(search)
    setShowDeleteModal(true)
  }

  const handleSaveClick = () => {
    const matchingSearch = getCurrentSearchMatch()
    if (matchingSearch) {
      setEditingSearch(matchingSearch)
      setSaveSearchName(matchingSearch.name)
      setIsOverwrite(true)
    } else {
      setEditingSearch(null)
      setSaveSearchName("")
      setIsOverwrite(false)
    }
    setShowSaveModal(true)
  }

  const handleUnsavedAction = (action: "save" | "discard") => {
    if (action === "save") {
      handleSaveClick()
    } else if (pendingAction) {
      pendingAction()
      setPendingAction(null)
    }
    setShowUnsavedModal(false)
  }

  const getSearchTooltip = (search: SavedSearch) => {
    const parts = []
    if (search.searchQuery) parts.push(`Search: "${search.searchQuery}"`)
    if (search.selectedCategories.length > 0) parts.push(`Categories: ${search.selectedCategories.join(", ")}`)
    if (search.selectedSectors.length > 0) parts.push(`Sectors: ${search.selectedSectors.join(", ")}`)
    if (search.selectedTags.length > 0) parts.push(`Tags: ${search.selectedTags.join(", ")}`)
    if (search.isPaywalled !== null) parts.push(`Access: ${search.isPaywalled ? "Paywalled" : "Free"}`)
    if (search.dateFrom || search.dateTo) {
      const dateRange = [
        search.dateFrom ? `From: ${search.dateFrom.toLocaleDateString()}` : "",
        search.dateTo ? `To: ${search.dateTo.toLocaleDateString()}` : "",
      ]
        .filter(Boolean)
        .join(", ")
      parts.push(dateRange)
    }
    return parts.length > 0 ? parts.join("\n") : "No filters applied"
  }

  return (
    <TooltipProvider>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-4 w-4" />
            <Label className="text-sm font-medium">Saved Searches</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveClick}
            disabled={!hasUnsavedChanges}
            className="text-xs h-7"
          >
            <SaveIcon className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-sm h-9">
              <span className="truncate">{activeSearch ? activeSearch.name : "Select a saved search..."}</span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="start">
            {savedSearches.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">No saved searches yet</div>
            ) : (
              savedSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between group">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem className="flex-1 cursor-pointer" onClick={() => handleLoadSearch(search)}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{search.name}</span>
                          <span className="text-xs text-muted-foreground">{search.createdAt.toLocaleDateString()}</span>
                        </div>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="whitespace-pre-line text-xs">{getSearchTooltip(search)}</div>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVerticalIcon className="h-3 w-3" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditSearch(search)}>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(search)} className="text-destructive">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
            {savedSearches.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSaveClick} disabled={!hasUnsavedChanges}>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Current Search
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save Modal */}
        <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isOverwrite ? "Update Saved Search" : "Save Search"}</DialogTitle>
              <DialogDescription>
                {isOverwrite
                  ? "Update the existing saved search with current filters and search terms."
                  : "Give your search a name to save it for later use."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">Search Name</Label>
                <Input
                  id="search-name"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Enter a name for this search..."
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Filters:</Label>
                <div className="flex flex-wrap gap-1 text-xs">
                  {currentSearch.searchQuery && <Badge variant="outline">Search: "{currentSearch.searchQuery}"</Badge>}
                  {currentSearch.selectedCategories.map((cat) => (
                    <Badge key={cat} variant="outline" className="bg-blue-50">
                      {cat}
                    </Badge>
                  ))}
                  {currentSearch.selectedSectors.map((sector) => (
                    <Badge key={sector} variant="outline" className="bg-green-50">
                      {sector}
                    </Badge>
                  ))}
                  {currentSearch.selectedTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-purple-50">
                      {tag}
                    </Badge>
                  ))}
                  {currentSearch.isPaywalled !== null && (
                    <Badge variant="outline" className="bg-amber-50">
                      {currentSearch.isPaywalled ? "Paywalled" : "Free Access"}
                    </Badge>
                  )}
                  {(currentSearch.dateFrom || currentSearch.dateTo) && (
                    <Badge variant="outline" className="bg-gray-50">
                      Date Range
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()}>
                {isOverwrite ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Saved Search</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{searchToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSearch}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unsaved Changes Warning Modal */}
        <Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
                Unsaved Changes
              </DialogTitle>
              <DialogDescription>
                You have unsaved changes to your current search. What would you like to do?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleUnsavedAction("discard")}>
                Discard Changes
              </Button>
              <Button onClick={() => handleUnsavedAction("save")}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
