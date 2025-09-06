"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Archive,
  ArchiveX,
  Check,
  Clock,
  Filter,
  Mail,
  MailOpen,
  MessageSquare,
  Reply,
  Search,
  Star,
  Trash2,
  User,
  RefreshCw,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageMutation,
  useDeleteContactMessageMutation,
} from "@/services/api"

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Project Inquiry",
    message:
      "I'm interested in discussing a potential project for my company. We're looking to redesign our website and add some new features. I was impressed by your portfolio and would love to chat about how we might work together. Could you let me know your availability for a call next week?",
    date: "2 days ago",
    read: false,
    starred: true,
    archived: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Collaboration Opportunity",
    message:
      "Your portfolio is impressive! I'd like to connect regarding a potential collaboration on an upcoming project. We're launching a new product and need someone with your skills to help with the digital presence. Let me know if you're interested and we can discuss details.",
    date: "5 days ago",
    read: true,
    starred: false,
    archived: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@techcorp.com",
    subject: "Freelance Position Available",
    message:
      "We have a freelance position available that might be a good fit for your skills. It's a 3-month contract with possibility of extension. The project involves creating a dashboard for our internal team. Let me know if you're interested and I can send more details.",
    date: "1 week ago",
    read: true,
    starred: false,
    archived: false,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@designstudio.com",
    subject: "Speaking Opportunity",
    message:
      "I'm organizing a design conference next month and would love to have you as a speaker. Your work in UI/UX is exactly the kind of expertise we want to showcase. The conference will be virtual, and sessions are 30-45 minutes. Please let me know if you're interested and available.",
    date: "2 weeks ago",
    read: true,
    starred: true,
    archived: false,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    subject: "Question about your process",
    message:
      "I'm a student studying web development and I'm really impressed by your portfolio. I was wondering if you could share some insights about your design process? Specifically, how do you approach the initial planning phase of a project? Any advice would be greatly appreciated!",
    date: "3 weeks ago",
    read: true,
    starred: false,
    archived: true,
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "lisa.t@bigcorp.com",
    subject: "Job opportunity at BigCorp",
    message:
      "We have an opening for a Senior Developer at BigCorp that aligns well with your experience. The role offers competitive compensation and benefits, with a flexible remote work policy. If you're interested, I'd love to set up a call to discuss further. Please let me know your thoughts.",
    date: "1 month ago",
    read: true,
    starred: false,
    archived: false,
  },
  {
    id: 7,
    name: "Alex Patel",
    email: "alex.p@startup.io",
    subject: "Startup collaboration",
    message:
      "I'm the founder of a new startup in the education space, and we're looking for a developer to help build our MVP. Your portfolio shows exactly the kind of clean, user-friendly design we're looking for. Would you be open to discussing a potential collaboration? We have secured initial funding.",
    date: "1 month ago",
    read: false,
    starred: false,
    archived: false,
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)

  // API hooks
  const { 
    data: messagesData, 
    isLoading, 
    error, 
    refetch 
  } = useGetContactMessagesQuery({ 
    page, 
    limit: 10, 
    filter: activeTab 
  })
  
  const [updateMessage] = useUpdateContactMessageMutation()
  const [deleteMessage] = useDeleteContactMessageMutation()

  const messages = messagesData?.contacts || []

  const handleGoBack = () => {
    router.back()
  }

  // Helper function to format relative date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`
  }

  const filteredMessages = messages.filter((message) => {
    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleMessageClick = async (message) => {
    // Mark as read if it wasn't already
    if (!message.read) {
      try {
        await updateMessage({
          id: message._id,
          updates: { read: true }
        }).unwrap()
      } catch (error) {
        console.error('Failed to mark message as read:', error)
      }
    }
    setSelectedMessage(message)
  }

  const handleStarMessage = async (e, messageId) => {
    e.stopPropagation()
    const message = messages.find(m => m._id === messageId)
    if (message) {
      try {
        await updateMessage({
          id: messageId,
          updates: { starred: !message.starred }
        }).unwrap()
        toast({
          title: message.starred ? "Message unstarred" : "Message starred",
          description: `Message from ${message.name} has been ${message.starred ? 'unstarred' : 'starred'}.`,
        })
      } catch (error) {
        console.error('Failed to update message:', error)
        toast({
          title: "Error",
          description: "Failed to update message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleArchiveMessage = async (messageId) => {
    const message = messages.find(m => m._id === messageId)
    if (message) {
      try {
        await updateMessage({
          id: messageId,
          updates: { archived: !message.archived }
        }).unwrap()
        
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null)
        }
        
        toast({
          title: message.archived ? "Message unarchived" : "Message archived",
          description: `Message from ${message.name} has been ${message.archived ? 'moved to inbox' : 'archived'}.`,
        })
      } catch (error) {
        console.error('Failed to archive message:', error)
        toast({
          title: "Error",
          description: "Failed to archive message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteMessage = async (messageId) => {
    const message = messages.find(m => m._id === messageId)
    if (message) {
      try {
        await deleteMessage(messageId).unwrap()
        
        if (selectedMessage?._id === messageId) {
          setSelectedMessage(null)
        }
        
        toast({
          title: "Message deleted",
          description: `Message from ${message.name} has been permanently deleted.`,
        })
      } catch (error) {
        console.error('Failed to delete message:', error)
        toast({
          title: "Error",
          description: "Failed to delete message. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleReply = () => {
    // In a real app, this would send the reply
    setIsReplyDialogOpen(false)
    setReplyText("")
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully.",
    })
  }

  const handleRefresh = () => {
    refetch()
    toast({
      title: "Messages refreshed",
      description: "Message list has been updated.",
    })
  }

  // Calculate counts based on current data
  const unreadCount = messages.filter((message) => !message.read && !message.archived).length
  const starredCount = messages.filter((message) => message.starred).length
  const archivedCount = messages.filter((message) => message.archived).length
  const totalCount = messages.length

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Failed to load messages</h2>
              <p className="text-muted-foreground mb-4">There was an error loading your messages.</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab('inbox')}>
                Inbox ({messages.filter(m => !m.archived).length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('starred')}>
                Starred ({starredCount})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('archived')}>
                Archived ({archivedCount})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="px-4 py-3">
              <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inbox" className="text-xs">
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="text-xs">
                    Starred
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="text-xs">
                    Archived
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-auto">
                {filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No messages found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeTab === "inbox"
                        ? "Your inbox is empty"
                        : activeTab === "starred"
                          ? "No starred messages"
                          : "No archived messages"}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {filteredMessages.map((message) => (
                      <li
                        key={message._id}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          selectedMessage?._id === message._id ? "bg-muted" : message.read ? "" : "bg-muted/20"
                        }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-primary/10 p-1.5 text-primary">
                                <User className="h-3.5 w-3.5" />
                              </div>
                              <div>
                                <p className={`text-sm ${!message.read ? "font-medium" : ""}`}>{message.name}</p>
                                <p className="text-xs text-muted-foreground">{message.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => handleStarMessage(e, message._id)}
                                className="text-muted-foreground hover:text-yellow-500"
                              >
                                <Star
                                  className={`h-4 w-4 ${message.starred ? "fill-yellow-500 text-yellow-500" : ""}`}
                                />
                                <span className="sr-only">{message.starred ? "Unstar" : "Star"}</span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className={`text-sm ${!message.read ? "font-medium" : ""}`}>{message.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{message.message}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatDate(message.createdAt)}
                            </div>
                            {!message.read && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      From: {selectedMessage.name} (
                      <span className="text-muted-foreground">{selectedMessage.email}</span>)
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchiveMessage(selectedMessage._id)}
                      title={selectedMessage.archived ? "Unarchive" : "Archive"}
                    >
                      {selectedMessage.archived ? <ArchiveX className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMessage(selectedMessage._id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleStarMessage(e, selectedMessage._id)}
                      title={selectedMessage.starred ? "Unstar" : "Star"}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatDate(selectedMessage.createdAt)}
                  </Badge>
                  {!selectedMessage.read && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      <MailOpen className="mr-1 h-3 w-3" />
                      Just Read
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                  Back to Messages
                </Button>
                <Button size="sm" onClick={() => setIsReplyDialogOpen(true)}>
                  <Reply className="mr-2 h-4 w-4" /> Reply
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No message selected</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md text-center">
                Select a message from the list to view its contents. You can reply, archive, or delete messages from the
                message view.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>Re: {selectedMessage?.subject}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Your Message</Label>
              <Textarea
                id="reply"
                placeholder="Type your reply here..."
                className="min-h-[200px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleReply}>
              <Check className="mr-2 h-4 w-4" /> Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
