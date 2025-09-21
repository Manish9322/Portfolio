import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useGetGalleryQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

// Define grid layout classes based on index
const gridClasses = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
];

interface GalleryItem {
  _id: string;
  imageUrl: string;
  caption: string;
  category: string;
  order?: number;
}

export default function GallerySection() {
  const { data: galleryData = [], isLoading } = useGetGalleryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Limit displayed images to 12
  const displayedImages = galleryData.slice(0, 12);
  const hasMoreImages = galleryData.length > 12;

  const handlePrevious = () => {
    if (selectedImage === null) return;
    const currentIndex = galleryData.findIndex(
      (img: GalleryItem) => img._id === selectedImage
    );
    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : galleryData.length - 1;
    setSelectedImage(galleryData[previousIndex]._id);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = galleryData.findIndex(
      (img: GalleryItem) => img._id === selectedImage
    );
    const nextIndex =
      currentIndex < galleryData.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(galleryData[nextIndex]._id);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border text-black dark:bg-black/10 border-black/10 text-sm font-medium mb-6 dark:text-white dark:border-white dark:border-white/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-black dark:bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
            </span>
            Photo Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Behind the Scenes
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            A showcase of my creative work and memorable moments
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl ${gridClasses[i]}`}
              >
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>
        ) : galleryData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
              {displayedImages.map((image: GalleryItem, index: number) => (
                <div
                  key={image._id}
                  className={`relative overflow-hidden rounded-xl group ${
                    gridClasses[index % gridClasses.length]
                  }`}
                  onClick={() => setSelectedImage(image._id)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.caption}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Tag in bottom left corner - shows on hover */}
                  <div className="absolute bottom-2 left-2 text-white px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.category}
                  </div>
                </div>
              ))}
            </div>

            {/* See All Moments Button */}
            {hasMoreImages && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => setShowAllGallery(true)}
                  variant="outline"
                  size="lg"
                  className="px-6 py-4 rounded-md"
                >
                  See All Moments ({galleryData.length})
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No gallery items found</p>
          </div>
        )}

        {/* Image Preview Modal */}
        <Dialog
          open={selectedImage !== null}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-sm p-0">
            <div className="relative h-[80vh] w-full">
              {selectedImage && (
                <Image
                  src={
                    galleryData.find(
                      (img: GalleryItem) => img._id === selectedImage
                    )?.imageUrl || ""
                  }
                  alt={
                    galleryData.find(
                      (img: GalleryItem) => img._id === selectedImage
                    )?.caption || ""
                  }
                  fill
                  className="object-contain"
                />
              )}

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/70"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Full Gallery Modal */}
        <Dialog open={showAllGallery} onOpenChange={setShowAllGallery}>
          <DialogContent className="max-w-7xl max-h-[90vh] bg-background/95 backdrop-blur-sm p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">All Gallery Moments</h3>
                <p className="text-muted-foreground">
                  {galleryData.length} images
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
                {galleryData.map((image: GalleryItem, index: number) => (
                  <div
                    key={image._id}
                    className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                    onClick={() => {
                      setShowAllGallery(false);
                      setSelectedImage(image._id);
                    }}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.caption}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Tag in bottom left corner - shows on hover */}
                    <div className="absolute bottom-2 left-2 text-white px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
