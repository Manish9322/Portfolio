"use client"

import { useState } from "react"
import {useRouter} from "next/navigation"
import {
  Archive,
  ArrowUpDown,
  Check,
  Clock,
  Filter,
  Mail,
  MailCheck,
  MailQuestion,
  MailX,
  MessageSquare,
  Reply,
  Search,
  Trash2,
  User,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define the ContactRequest type first
interface ContactRequest {
  id: number
  name: string
  email: string
  message: string
  date: string
  status: "new" | "in-progress" | "completed"
  responded: boolean
  archived: boolean
}

// Mock data for contact requests based on the ContactSection component
const mockContactRequests: ContactRequest[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    message:
      "I'm interested in discussing a potential project for my company. We're looking to redesign our website and add some new features. I was impressed by your portfolio and would love to chat about how we might work together.",
    date: "2023-11-15",
    status: "new",
    responded: false,
    archived: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    message:
      "Your portfolio is impressive! I'd like to connect regarding a potential collaboration on an upcoming project. We're launching a new product and need someone with your skills to help with the digital presence.",
    date: "2023-11-10",
    status: "in-progress",
    responded: false,
    archived: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@techcorp.com",
    message:
      "We have a freelance position available that might be a good fit for your skills. It's a 3-month contract with possibility of extension. The project involves creating a dashboard for our internal team.",
    date: "2023-11-05",
    status: "completed",
    responded: true,
    archived: false,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@designstudio.com",
    message:
      "I'm organizing a design conference next month and would love to have you as a speaker. Your work in UI/UX is exactly the kind of expertise we want to showcase. The conference will be virtual, and sessions are 30-45 minutes.",
    date: "2023-10-28",
    status: "completed",
    responded: true,
    archived: true,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    message:
      "I came across your portfolio and was really impressed by your project work. I have a small business and need help with branding and website development. Would love to discuss if you're available for new projects.",
    date: "2023-10-20",
    status: "new",
    responded: false,
    archived: false,
  },
];

interface ContactRequest {
  id: number
  name: string
  email: string
  message: string
  date: string
  status: "new" | "in-progress" | "completed"
  responded: boolean
  archived: boolean
}

export default function ContactRequestsPage() {
  const router = useRouter()
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>(mockContactRequests)
  const [selectedTab, setSelectedTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter contact requests based on the selected tab and search query
  const filteredRequests = contactRequests
    .filter((request) => {
      // Filter by tab
      if (selectedTab === "all") return !request.archived
      if (selectedTab === "new") return request.status === "new" && !request.archived
      if (selectedTab === "in-progress") return request.status === "in-progress" && !request.archived
      if (selectedTab === "completed") return request.status === "completed" && !request.archived
      if (selectedTab === "archived") return request.archived
      return true
    })
    .filter((request) => {
      // Filter by search query
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        request.name.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query) ||
        request.message.toLowerCase().includes(query)
      )
    })

  // Handle marking a request as in-progress
  const handleMarkInProgress = (request: ContactRequest) => {
    setContactRequests(
      contactRequests.map((r) =>
        r.id === request.id ? { ...r, status: "in-progress" } : r
      )
    )
  }

  // Handle marking a request as completed
  const handleMarkCompleted = (request: ContactRequest) => {
    setContactRequests(
      contactRequests.map((r) =>
        r.id === request.id ? { ...r, status: "completed", responded: true } : r
      )
    )
  }

  // Handle archiving a request
  const handleArchive = (request: ContactRequest) => {
    setContactRequests(
      contactRequests.map((r) =>
        r.id === request.id ? { ...r, archived: true } : r
      )
    )
  }

  // Handle unarchiving a request
  const handleUnarchive = (request: ContactRequest) => {
    setContactRequests(
      contactRequests.map((r) =>
        r.id === request.id ? { ...r, archived: false } : r
      )
    )
  }

  // Handle deleting a request
  const handleDelete = () => {
    if (!selectedRequest) return

    setContactRequests(
      contactRequests.filter((r) => r.id !== selectedRequest.id)
    )
    
    setIsDeleteDialogOpen(false)
    setSelectedRequest(null)
  }

  // Handle sending a reply
  const handleSendReply = () => {
    if (!selectedRequest || !replyMessage) return

    // In a real app, you would send an email here
    console.log(`Sending reply to ${selectedRequest.email}:`, replyMessage)

    // Update the request status
    setContactRequests(
      contactRequests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "completed", responded: true } : r
      )
    )
    
    setIsReplyDialogOpen(false)
    setSelectedRequest(null)
    setReplyMessage("")
  }

  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-500">
            New
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-500">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500">
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contact Requests</h2>
          <p className="text-muted-foreground">
            Manage and respond to messages from your contact form
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedTab}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <TabsList>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="new" className="text-xs sm:text-sm">
              New
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Completed
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs sm:text-sm">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search contact requests..."
              className="h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              disabled={!searchQuery}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No contact requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.date}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {request.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="truncate max-w-[300px]">{request.message}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        {!request.responded && !request.archived && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsReplyDialogOpen(true)
                            }}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {!request.archived ? (
                              <>
                                {request.status !== "in-progress" && (
                                  <DropdownMenuItem onClick={() => handleMarkInProgress(request)}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                )}
                                {request.status !== "completed" && (
                                  <DropdownMenuItem onClick={() => handleMarkCompleted(request)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleArchive(request)}>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUnarchive(request)}>
                                <MailCheck className="mr-2 h-4 w-4" />
                                Unarchive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedRequest(request)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>

      {/* View Contact Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Contact Request Details</DialogTitle>
            <DialogDescription>
              Viewing full details of the selected contact request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">From:</p>
                  <p className="text-base">{selectedRequest.name}</p>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm">{selectedRequest.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Date:</p>
                <p className="text-sm">{selectedRequest.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Message:</p>
                <div className="p-3 rounded-md bg-muted">
                  <p className="text-sm whitespace-pre-line">{selectedRequest.message}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Status:</p>
                <p className="text-sm">
                  {selectedRequest.responded ? "Responded" : "Not Responded"}
                  {selectedRequest.archived && " (Archived)"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex space-x-2">
              {selectedRequest && !selectedRequest.responded && !selectedRequest.archived && (
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsReplyDialogOpen(true)
                  }}
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Contact Request</DialogTitle>
            <DialogDescription>
              Send a response to the contact request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">To:</p>
                <p className="text-sm">
                  {selectedRequest.name} ({selectedRequest.email})
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Original Message:</p>
                <div className="p-3 rounded-md bg-muted max-h-24 overflow-y-auto">
                  <p className="text-sm text-muted-foreground">{selectedRequest.message}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  placeholder="Type your response here..."
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply}
              disabled={!replyMessage}
            >
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
