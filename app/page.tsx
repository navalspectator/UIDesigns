"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"

// Sample data for demonstration
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
    comments: [],
  },
]

export default function PostExplorationPage() {
  const [posts, setPosts] = useState(samplePosts)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore Posts</h1>
        <Button className="rounded-full" size="icon" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Create Post</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </main>
  )
}
