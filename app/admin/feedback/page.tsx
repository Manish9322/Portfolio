"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Filter,
  MoreVertical,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  useGetFeedbacksQuery,
  useAddFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
  useReorderFeedbacksMutation,
} from "@/services/api"

interface Feedback {
  _id: string
  name: string
  role: string
  feedback: string
  type: "project" | "general"
  projectName?: string
  rating: number
  isVisible: boolean
  isApproved: boolean
  order: number
  email?: string
  company?: string
  createdAt: string
  updatedAt: string
}

interface FeedbackForm {
  name: string
  role: string
  feedback: string
  type: "project" | "general"
  projectName: string
  rating: number
  email: string
  company: string
}

const initialFormData: FeedbackForm = {
  name: "",
  role: "",
  feedback: "",
  type: "general",
  projectName: "",
  rating: 5,
  email: "",
  company: "",
}

export default function FeedbackPage() {
  const { toast } = useToast()
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null)
  const [deletingFeedback, setDeletingFeedback] = useState<Feedback | null>(null)
  const [formData, setFormData] = useState<FeedbackForm>(initialFormData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "project" | "general">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [draggedItem, setDraggedItem] = useState<Feedback | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  // API hooks
  const { data: feedbackData, isLoading, error, refetch } = useGetFeedbacksQuery({})
  const [addFeedback, { isLoading: isAdding }] = useAddFeedbackMutation()
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation()
  const [deleteFeedback, { isLoading: isDeleting }] = useDeleteFeedbackMutation()
  const [reorderFeedbacks] = useReorderFeedbacksMutation()

  const feedbacks = feedbackData?.success ? feedbackData.data : []

  // Filter feedbacks based on search and filters
  const filteredFeedbacks = feedbacks.filter((feedback: Feedback) => {
    const matchesSearch = 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.projectName && feedback.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === "all" || feedback.type === filterType
    
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "approved" && feedback.isApproved) ||
      (filterStatus === "pending" && !feedback.isApproved)

    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => a.order - b.order)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.role || !formData.feedback) {
      toast({
        title: "Error",
        description: "Name, role, and feedback are required",
        variant: "destructive",
      })
      return
    }

    if (formData.type === "project" && !formData.projectName) {
      toast({
        title: "Error",
        description: "Project name is required for project feedback",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingFeedback) {
        await updateFeedback({
          id: editingFeedback._id,
          ...formData,
        }).unwrap()
        
        toast({
          title: "Success",
          description: "Feedback updated successfully",
        })
        
        setIsEditDialogOpen(false)
        setEditingFeedback(null)
      } else {
        await addFeedback(formData).unwrap()
        
        toast({
          title: "Success",
          description: "Feedback added successfully",
        })
        
        setIsAddDialogOpen(false)
      }
      
      setFormData(initialFormData)
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback)
    setFormData({
      name: feedback.name,
      role: feedback.role,
      feedback: feedback.feedback,
      type: feedback.type,
      projectName: feedback.projectName || "",
      rating: feedback.rating,
      email: feedback.email || "",
      company: feedback.company || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingFeedback) return

    try {
      await deleteFeedback(deletingFeedback._id).unwrap()
      
      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      })
      
      setIsDeleteDialogOpen(false)
      setDeletingFeedback(null)
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete feedback",
        variant: "destructive",
      })
    }
  }

  const handleToggleVisibility = async (feedback: Feedback) => {
    try {
      await updateFeedback({
        id: feedback._id,
        isVisible: !feedback.isVisible,
      }).unwrap()
      
      toast({
        title: "Success",
        description: `Feedback ${!feedback.isVisible ? 'shown' : 'hidden'} successfully`,
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update visibility",
        variant: "destructive",
      })
    }
  }

  const handleToggleApproval = async (feedback: Feedback) => {
    try {
      await updateFeedback({
        id: feedback._id,
        isApproved: !feedback.isApproved,
      }).unwrap()
      
      toast({
        title: "Success",
        description: `Feedback ${!feedback.isApproved ? 'approved' : 'unapproved'} successfully`,
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update approval status",
        variant: "destructive",
      })
    }
  }

  const handleMoveUp = async (feedback: Feedback, index: number) => {
    if (index === 0) return

    const reorderedFeedbacks = [...filteredFeedbacks]
    const temp = reorderedFeedbacks[index]
    reorderedFeedbacks[index] = reorderedFeedbacks[index - 1]
    reorderedFeedbacks[index - 1] = temp

    try {
      const feedbackIds = reorderedFeedbacks.map((f: Feedback) => f._id)
      await reorderFeedbacks(feedbackIds).unwrap()
      
      toast({
        title: "Success",
        description: "Feedback order updated successfully",
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to reorder feedbacks",
        variant: "destructive",
      })
    }
  }

  const handleMoveDown = async (feedback: Feedback, index: number) => {
    if (index === filteredFeedbacks.length - 1) return

    const reorderedFeedbacks = [...filteredFeedbacks]
    const temp = reorderedFeedbacks[index]
    reorderedFeedbacks[index] = reorderedFeedbacks[index + 1]
    reorderedFeedbacks[index + 1] = temp

    try {
      const feedbackIds = reorderedFeedbacks.map((f: Feedback) => f._id)
      await reorderFeedbacks(feedbackIds).unwrap()
      
      toast({
        title: "Success",
        description: "Feedback order updated successfully",
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to reorder feedbacks",
        variant: "destructive",
      })
    }
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, feedback: Feedback) => {
    setDraggedItem(feedback)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, feedback: Feedback) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOver(feedback._id)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = async (e: React.DragEvent, targetFeedback: Feedback) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem._id === targetFeedback._id) {
      setDraggedItem(null)
      setDraggedOver(null)
      return
    }

    const draggedIndex = filteredFeedbacks.findIndex(f => f._id === draggedItem._id)
    const targetIndex = filteredFeedbacks.findIndex(f => f._id === targetFeedback._id)

    if (draggedIndex === -1 || targetIndex === -1) return

    const reorderedFeedbacks = [...filteredFeedbacks]
    const [removed] = reorderedFeedbacks.splice(draggedIndex, 1)
    reorderedFeedbacks.splice(targetIndex, 0, removed)

    try {
      const feedbackIds = reorderedFeedbacks.map((f: Feedback) => f._id)
      await reorderFeedbacks(feedbackIds).unwrap()
      
      toast({
        title: "Success",
        description: "Feedback order updated successfully",
      })
      
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to reorder feedbacks",
        variant: "destructive",
      })
    }

    setDraggedItem(null)
    setDraggedOver(null)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingFeedback(null)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage client testimonials and feedback submissions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feedback
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
                  <p className="text-2xl font-bold">{feedbacks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {feedbacks.filter((f: Feedback) => f.isApproved).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Visible</p>
                  <p className="text-2xl font-bold">
                    {feedbacks.filter((f: Feedback) => f.isVisible).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <StarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {feedbacks.length > 0 
                      ? (feedbacks.reduce((acc: number, f: Feedback) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
                      : "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search feedbacks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading feedbacks...</span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground mb-4">
                {feedbacks.length === 0 ? "No feedbacks found" : "No feedbacks match your filters"}
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Feedback
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback: Feedback, index: number) => (
              <Card 
                key={feedback._id} 
                className={`relative cursor-move transition-all duration-200 ${
                  draggedOver === feedback._id ? 'border-primary shadow-lg' : ''
                } ${
                  draggedItem?._id === feedback._id ? 'opacity-50 scale-95' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, feedback)}
                onDragOver={(e) => handleDragOver(e, feedback)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, feedback)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg cursor-grab hover:bg-muted-foreground/10">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">{feedback.name}</CardTitle>
                          <Badge
                            variant={feedback.type === "project" ? "default" : "secondary"}
                          >
                            {feedback.type}
                          </Badge>
                          {!feedback.isApproved && (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                          {!feedback.isVisible && (
                            <Badge variant="outline">Hidden</Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          {feedback.role}
                          {feedback.company && ` at ${feedback.company}`}
                        </div>
                        
                        {feedback.projectName && (
                          <div className="text-sm text-muted-foreground mb-2">
                            Project: <span className="font-medium">{feedback.projectName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            {renderStars(feedback.rating)}
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={feedback.isApproved}
                              onCheckedChange={() => handleToggleApproval(feedback)}
                              size="sm"
                            />
                            <span className="text-xs text-muted-foreground">Approved</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={feedback.isVisible}
                              onCheckedChange={() => handleToggleVisibility(feedback)}
                              size="sm"
                            />
                            <span className="text-xs text-muted-foreground">Visible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {/* Move Up/Down */}
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveUp(feedback, index)}
                          disabled={index === 0}
                          className="p-1 h-6"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveDown(feedback, index)}
                          disabled={index === filteredFeedbacks.length - 1}
                          className="p-1 h-6"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Action Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(feedback)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleApproval(feedback)}>
                            {feedback.isApproved ? (
                              <>
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Unapprove
                              </>
                            ) : (
                              <>
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approve
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleVisibility(feedback)}>
                            {feedback.isVisible ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Show
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setDeletingFeedback(feedback)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <blockquote className="text-muted-foreground italic border-l-4 border-muted pl-4">
                    "{feedback.feedback}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {feedback.email && (
                        <span className="mr-4">📧 {feedback.email}</span>
                      )}
                      <span>📅 {new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Order: {feedback.order}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog 
          open={isAddDialogOpen || isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
              resetForm()
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFeedback ? "Edit Feedback" : "Add New Feedback"}
              </DialogTitle>
              <DialogDescription>
                {editingFeedback 
                  ? "Update the feedback details below."
                  : "Fill in the details to add a new feedback."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Frontend Developer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Feedback Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "project" | "general") => 
                      setFormData(prev => ({ ...prev, type: value, projectName: value === "general" ? "" : prev.projectName }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="project">Project Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, rating: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐ 1 Star</SelectItem>
                      <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type === "project" && (
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Enter project name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback *</Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Write the feedback here..."
                  className="min-h-[100px] resize-y"
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setIsEditDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAdding || isUpdating}
                >
                  {(isAdding || isUpdating) && (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingFeedback ? "Update Feedback" : "Add Feedback"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the feedback
                from "{deletingFeedback?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingFeedback(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Delete Feedback
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
