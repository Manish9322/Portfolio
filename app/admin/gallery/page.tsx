"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Eye, Pencil, Trash2, Upload } from "lucide-react";
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
}

export default function GalleryPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [newImage, setNewImage] = useState({
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
        
        setImages(data.map((item: any) => ({
          id: item._id,
          name: item.title,
          tag: item.category,
          imageUrl: item.imageUrl,
          visible: true,
        })));
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
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="relative h-12 w-12">
                      <Image
                        src={image.imageUrl}
                      alt={image.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </TableCell>
                <TableCell>{image.name}</TableCell>
                <TableCell>{image.tag}</TableCell>
                <TableCell>
                  <Switch
                    checked={image.visible}
                    onCheckedChange={() => handleVisibilityToggle(image.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(image)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedImage(image);
                        setIsAddModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedImage ? "Edit Image" : "Add New Image"}
            </DialogTitle>
            <DialogDescription>
              {selectedImage
                ? "Edit the image details below"
                : "Upload a new image and fill in the details"}
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
                {isLoading
                  ? "Saving..."
                  : selectedImage
                  ? "Save Changes"
                  : "Add Image"}
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
