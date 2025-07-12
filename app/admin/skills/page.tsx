"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Plus, Trash, Save, ArrowUp, ArrowDown, GripVertical } from "lucide-react"

interface Skill {
  _id: string;
  category: string;
  items: string[];
}

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
import {
  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useUpdateSkillOrderMutation
} from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<{ _id: string; category: string; items: string[] } | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    items: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [skillsOrder, setSkillsOrder] = useState<Skill[]>([])

  const { data: skills = [], isLoading } = useGetSkillsQuery(undefined);
  const [addSkill] = useAddSkillMutation()
  const [updateSkill] = useUpdateSkillMutation()
  const [deleteSkill] = useDeleteSkillMutation()
  const [updateSkillOrder] = useUpdateSkillOrderMutation()

  // Initialize skillsOrder when skills data is loaded
  if (skills.length > 0 && skillsOrder.length === 0 && !isLoading) {
    setSkillsOrder(skills);
  }

  const handleEditSkill = (skill: Skill) => {
    setIsEditing(true)
    setCurrentSkill(skill)
    setFormData({
      category: skill.category,
      items: skill.items.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleNewSkill = () => {
    setIsEditing(false)
    setCurrentSkill(null)
    setFormData({
      category: "",
      items: "",
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const skillData = {
        category: formData.category,
        items: formData.items.split(',').map(item => item.trim()).filter(item => item),
      }

      if (isEditing && currentSkill) {
        await updateSkill({
          _id: currentSkill._id,
          ...skillData
        }).unwrap()
      } else {
        await addSkill(skillData).unwrap()
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving skill:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSkill = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) {
      return
    }

    try {
      await deleteSkill(_id).unwrap()
      setSkillsOrder(skillsOrder.filter(skill => skill._id !== _id))
    } catch (error) {
      console.error("Error deleting skill:", error)
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return; // Can't move up if already at the top
    const newOrder = [...skillsOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSkillsOrder(newOrder);
  }

  const handleMoveDown = (index: number) => {
    if (index === skillsOrder.length - 1) return; // Can't move down if already at the bottom
    const newOrder = [...skillsOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setSkillsOrder(newOrder);
  }

  const handleSaveOrder = async () => {
    try {
      const orderedIds = skillsOrder.map(skill => skill._id);
      await updateSkillOrder({ orderedIds }).unwrap();
      alert("Skill order saved successfully!");
    } catch (error) {
      console.error("Error saving skill order:", error);
      alert("Failed to save skill order.");
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return <div className="p-6 max-w-7xl mx-auto">
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Manage Education</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewSkill}>
            <Plus className="mr-2 h-4 w-4" /> Add Skill Category
          </Button>
          <Button onClick={handleSaveOrder} disabled={skillsOrder.length === 0}>
            <Save className="mr-2 h-4 w-4" /> Save Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsOrder.map((skill: Skill, index: number) => (
          <Card key={skill._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{skill.category}</CardTitle>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === skillsOrder.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{skill.items.length} skills in this category</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditSkill(skill)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteSkill(skill._id)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Skill Category" : "Add New Skill Category"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your skill category and items."
                : "Add a new skill category to showcase on your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend, Backend, Design"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Skills (comma separated)</Label>
                <Input
                  id="items"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  placeholder="React, TypeScript, Tailwind CSS"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter skills separated by commas. These will be displayed as tags on your portfolio.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditing ? "Update Skills" : "Add Skills"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}