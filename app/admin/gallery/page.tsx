"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Eye, Pencil, Trash2, Upload, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,  
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageItem {
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  visible: boolean;
  order: number;
}

interface SortableTableRowProps {
  image: ImageItem;
  onView: (image: ImageItem) => void;
  onEdit: (image: ImageItem) => void;
  onDelete: (image: ImageItem) => void;
  onVisibilityToggle: (id: string) => void;
}

function SortableTableRow({ image, onView, onEdit, onDelete, onVisibilityToggle }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "relative z-50" : ""}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <div className="relative h-12 w-12">
            <Image
              src={image.imageUrl}
              alt={image.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </TableCell>
      <TableCell>{image.name}</TableCell>
      <TableCell>{image.tag}</TableCell>
      <TableCell>
        <Switch
          checked={image.visible}
          onCheckedChange={() => onVisibilityToggle(image.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(image)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(image)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(image)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function GalleryPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // States
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [newImage, setNewImage] = useState({
    name: "",
    tag: "",
    file: null as File | null,
  });
  const [editImage, setEditImage] = useState({
    name: "",
    tag: "",
    file: null as File | null,
  });

  // Fetch gallery images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        
        setImages(data.map((item: any, index: number) => ({
          id: item._id,
          name: item.title,
          tag: item.category,
          imageUrl: item.imageUrl,
          visible: true,
          order: item.order ?? index, // Use existing order or fallback to index
        })).sort((a: ImageItem, b: ImageItem) => a.order - b.order)); // Sort by order
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Drag and drop handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over?.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      
      // Update order property for each image
      const updatedImages = newImages.map((img, index) => ({
        ...img,
        order: index,
      }));

      setImages(updatedImages);

      // Persist the new order to the database
      try {
        await fetch('/api/gallery/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: updatedImages.map((img) => ({
              id: img.id,
              order: img.order,
            })),
          }),
        });

        toast({
          title: "Success",
          description: "Image order updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update image order",
          variant: "destructive",
        });
        
        // Revert on error
        setImages(images);
      }
    }
  };

  // Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage((prev) => ({ ...prev, file }));
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.file || !newImage.name || !newImage.tag) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First upload the image file
      const formData = new FormData();
      formData.append("file", newImage.file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");
      const uploadData = await uploadResponse.json();

      // Then create the gallery item in the database
      const galleryResponse = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newImage.name,
          category: newImage.tag,
          imageUrl: uploadData.url,
          description: ""
        }),
      });

      if (!galleryResponse.ok) throw new Error("Failed to save gallery item");
      const galleryData = await galleryResponse.json();

      setImages((prev) => [
        ...prev,
        {
          id: galleryData._id,
          name: galleryData.title,
          tag: galleryData.category,
          imageUrl: galleryData.imageUrl,
          visible: true,
          order: prev.length, // Add at the end
        },
      ]);

      setIsAddModalOpen(false);
      setNewImage({ name: "", tag: "", file: null });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editImage.name || !editImage.tag) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "Error", 
        description: "No image selected for editing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = selectedImage.imageUrl;

      // If a new file is selected, upload it first
      if (editImage.file) {
        const formData = new FormData();
        formData.append("file", editImage.file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Upload failed");
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Update the gallery item in the database
      const galleryResponse = await fetch(`/api/gallery`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: selectedImage.id,
          title: editImage.name,
          category: editImage.tag,
          imageUrl: imageUrl,
          description: ""
        }),
      });

      if (!galleryResponse.ok) throw new Error("Failed to update gallery item");
      const galleryData = await galleryResponse.json();

      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage.id
            ? {
                id: galleryData._id,
                name: galleryData.title,
                tag: galleryData.category,
                imageUrl: galleryData.imageUrl,
                visible: img.visible,
                order: img.order, // Keep the existing order
              }
            : img
        )
      );

      setIsEditModalOpen(false);
      setSelectedImage(null);
      setEditImage({ name: "", tag: "", file: null });
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: ImageItem) => {
    setSelectedImage(image);
    setEditImage({
      name: image.name,
      tag: image.tag,
      file: null,
    });
    setIsEditModalOpen(true);
  };

  const handleVisibilityToggle = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, visible: !img.visible } : img
      )
    );
  };

  const handleDelete = (image: ImageItem) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/gallery?id=${selectedImage.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      setImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedImage(null);
    }
  };

  const handleView = (image: ImageItem) => {
    setSelectedImage(image);
    setIsViewModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gallery</h1>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Image
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                  {images.map((image) => (
                    <SortableTableRow
                      key={image.id}
                      image={image}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onVisibilityToggle={handleVisibilityToggle}
                    />
                  ))}
                </SortableContext>
                {images.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No images found. Add some!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DndContext>
      )}

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open);
        if (!open) {
          setNewImage({ name: "", tag: "", file: null });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Image</DialogTitle>
            <DialogDescription>
              Upload a new image and fill in the details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddImage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Image Name</Label>
              <Input
                id="name"
                value={newImage.name}
                onChange={(e) =>
                  setNewImage((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter image name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={newImage.tag}
                onChange={(e) =>
                  setNewImage((prev) => ({ ...prev, tag: e.target.value }))
                }
                placeholder="Enter tag"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {newImage.file ? "Change Image" : "Upload Image"}
                </Button>
                {newImage.file && (
                  <span className="text-sm text-muted-foreground">
                    {newImage.file.name}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Add Image"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setSelectedImage(null);
          setEditImage({ name: "", tag: "", file: null });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Edit the image details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateImage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Image Name</Label>
              <Input
                id="edit-name"
                value={editImage.name}
                onChange={(e) =>
                  setEditImage((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter image name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tag">Tag</Label>
              <Input
                id="edit-tag"
                value={editImage.tag}
                onChange={(e) =>
                  setEditImage((prev) => ({ ...prev, tag: e.target.value }))
                }
                placeholder="Enter tag"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image File (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditImage((prev) => ({ ...prev, file }));
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('edit-image')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {editImage.file ? "Change Image" : "Upload New Image"}
                </Button>
                {editImage.file && (
                  <span className="text-sm text-muted-foreground">
                    {editImage.file.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the current image
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
            <DialogDescription>{selectedImage?.tag}</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-video w-full">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image
              from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
