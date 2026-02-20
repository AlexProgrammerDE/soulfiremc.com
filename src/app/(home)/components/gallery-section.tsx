"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function GallerySection({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const prev = () =>
    setOpenIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const next = () =>
    setOpenIndex((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-video overflow-hidden rounded-lg bg-muted ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent className="max-w-4xl p-2 sm:p-4">
          <DialogTitle className="sr-only">
            {openIndex !== null ? images[openIndex].alt : "Gallery image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Image {openIndex !== null ? openIndex + 1 : 0} of {images.length}
          </DialogDescription>
          {openIndex !== null && (
            <div className="relative aspect-video w-full">
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
