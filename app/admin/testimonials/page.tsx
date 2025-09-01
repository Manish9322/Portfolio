"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Edit, 
  Trash, 
  Star, 
  StarHalf, 
  CheckCircle2,
  XCircle,
  User
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock testimonial data based on the TestimonialSection component
const mockTestimonials = [
  {
    id: 1,
    feedback:
      "Outstanding work! The attention to detail and professional execution exceeded our expectations completely.",
    name: "Alice Johnson",
    role: "Product Manager",
    featured: true,
    approved: true,
    date: "2023-06-15",
  },
  {
    id: 2,
    feedback:
      "A pleasure to work with, always delivers on time with exceptional quality and clear communication.",
    name: "Michael Lee",
    role: "Lead Developer",
    featured: true,
    approved: true,
    date: "2023-07-22",
  },
  {
    id: 3,
    feedback:
      "Creative, reliable, and highly skilled. The solutions provided were innovative and effective.",
    name: "Priya Singh",
    role: "UX Designer",
    featured: true,
    approved: true,
    date: "2023-08-10",
  },
  {
    id: 4,
    feedback:
      "Transformed our ideas into reality with professionalism and technical expertise that impressed our team.",
    name: "Carlos Rivera",
    role: "Startup Founder",
    featured: true,
    approved: true,
    date: "2023-09-05",
  },
  {
    id: 5,
    feedback:
      "Excellent communication and top-notch results. Every project milestone was met with precision.",
    name: "Sophie Müller",
    role: "Marketing Lead",
    featured: false,
    approved: false,
    date: "2023-10-18",
  },
];

interface Testimonial {
  id: number
  feedback: string
  name: string
  role: string
  featured: boolean
  approved: boolean
  date: string
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials)
  const [selectedTab, setSelectedTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, "id" | "date">>({
    feedback: "",
    name: "",
    role: "",
    featured: false,
    approved: false,
  })

  // Filter testimonials based on the selected tab
  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (selectedTab === "all") return true
    if (selectedTab === "featured") return testimonial.featured
    if (selectedTab === "approved") return testimonial.approved
    if (selectedTab === "pending") return !testimonial.approved
    return true
  })

  // Handle adding a new testimonial
  const handleAddTestimonial = () => {
    const newId = Math.max(...testimonials.map((t) => t.id)) + 1
    const currentDate = new Date().toISOString().split("T")[0]
    
    setTestimonials([
      ...testimonials,
      {
        id: newId,
        ...newTestimonial,
        date: currentDate,
      },
    ])
    
    setIsAddDialogOpen(false)
    setNewTestimonial({
      feedback: "",
      name: "",
      role: "",
      featured: false,
      approved: false,
    })
  }

  // Handle editing a testimonial
  const handleEditTestimonial = () => {
    if (!selectedTestimonial) return

    setTestimonials(
      testimonials.map((testimonial) =>
        testimonial.id === selectedTestimonial.id ? selectedTestimonial : testimonial
      )
    )
    
    setIsEditDialogOpen(false)
    setSelectedTestimonial(null)
  }

  // Handle deleting a testimonial
  const handleDeleteTestimonial = () => {
    if (!selectedTestimonial) return

    setTestimonials(
      testimonials.filter((testimonial) => testimonial.id !== selectedTestimonial.id)
    )
    
    setIsDeleteDialogOpen(false)
    setSelectedTestimonial(null)
  }

  // Handle toggling the featured status
  const handleToggleFeatured = (testimonial: Testimonial) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === testimonial.id ? { ...t, featured: !t.featured } : t
      )
    )
  }

  // Handle toggling the approved status
  const handleToggleApproved = (testimonial: Testimonial) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === testimonial.id ? { ...t, approved: !t.approved } : t
      )
    )
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">
            Manage client testimonials that appear on your portfolio
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-xs sm:text-sm">
              Featured
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm">
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              Pending
            </TabsTrigger>
          </TabsList>
          <div className="hidden md:flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search testimonials..."
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={() => {
                  setSelectedTestimonial(testimonial)
                  setIsEditDialogOpen(true)
                }}
                onDelete={() => {
                  setSelectedTestimonial(testimonial)
                  setIsDeleteDialogOpen(true)
                }}
                onToggleFeatured={() => handleToggleFeatured(testimonial)}
                onToggleApproved={() => handleToggleApproved(testimonial)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={() => {
                  setSelectedTestimonial(testimonial)
                  setIsEditDialogOpen(true)
                }}
                onDelete={() => {
                  setSelectedTestimonial(testimonial)
                  setIsDeleteDialogOpen(true)
                }}
                onToggleFeatured={() => handleToggleFeatured(testimonial)}
                onToggleApproved={() => handleToggleApproved(testimonial)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={() => {
                  setSelectedTestimonial(testimonial)
                  setIsEditDialogOpen(true)
                }}
                onDelete={() => {
                  setSelectedTestimonial(testimonial)
                  setIsDeleteDialogOpen(true)
                }}
                onToggleFeatured={() => handleToggleFeatured(testimonial)}
                onToggleApproved={() => handleToggleApproved(testimonial)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={() => {
                  setSelectedTestimonial(testimonial)
                  setIsEditDialogOpen(true)
                }}
                onDelete={() => {
                  setSelectedTestimonial(testimonial)
                  setIsDeleteDialogOpen(true)
                }}
                onToggleFeatured={() => handleToggleFeatured(testimonial)}
                onToggleApproved={() => handleToggleApproved(testimonial)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Testimonial Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Add a new client testimonial to showcase on your portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Client Role/Company</Label>
              <Input
                id="role"
                value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Testimonial</Label>
              <Textarea
                id="feedback"
                rows={4}
                value={newTestimonial.feedback}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newTestimonial.featured}
                  onCheckedChange={(checked) => setNewTestimonial({ ...newTestimonial, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="approved"
                  checked={newTestimonial.approved}
                  onCheckedChange={(checked) => setNewTestimonial({ ...newTestimonial, approved: checked })}
                />
                <Label htmlFor="approved">Approved</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setNewTestimonial({
                  feedback: "",
                  name: "",
                  role: "",
                  featured: false,
                  approved: false,
                })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTestimonial}>Add Testimonial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial details
            </DialogDescription>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Client Name</Label>
                <Input
                  id="edit-name"
                  value={selectedTestimonial.name}
                  onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Client Role/Company</Label>
                <Input
                  id="edit-role"
                  value={selectedTestimonial.role}
                  onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-feedback">Testimonial</Label>
                <Textarea
                  id="edit-feedback"
                  rows={4}
                  value={selectedTestimonial.feedback}
                  onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, feedback: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={selectedTestimonial.featured}
                    onCheckedChange={(checked) => setSelectedTestimonial({ ...selectedTestimonial, featured: checked })}
                  />
                  <Label htmlFor="edit-featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-approved"
                    checked={selectedTestimonial.approved}
                    onCheckedChange={(checked) => setSelectedTestimonial({ ...selectedTestimonial, approved: checked })}
                  />
                  <Label htmlFor="edit-approved">Approved</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTestimonial}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Testimonial Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTestimonial}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// TestimonialCard component for displaying each testimonial
function TestimonialCard({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleApproved,
}: {
  testimonial: Testimonial
  onEdit: () => void
  onDelete: () => void
  onToggleFeatured: () => void
  onToggleApproved: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <User className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <CardTitle className="text-base">{testimonial.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            {testimonial.featured && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500">
                Featured
              </Badge>
            )}
            {testimonial.approved ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500">
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-500">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-4">
          "{testimonial.feedback}"
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Added on {testimonial.date}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 pb-3">
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={onToggleFeatured} title={testimonial.featured ? "Remove from featured" : "Add to featured"}>
            {testimonial.featured ? (
              <Star className="h-4 w-4 text-yellow-500" />
            ) : (
              <StarHalf className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleApproved} title={testimonial.approved ? "Unapprove" : "Approve"}>
            {testimonial.approved ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-orange-500" />
            )}
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
