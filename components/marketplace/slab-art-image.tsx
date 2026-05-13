"use client";

import type { ListingImage } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type SlabArtImageProps = {
  image: ListingImage;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function SlabArtImage({
  image,
  className,
}: SlabArtImageProps) {
  return (
    // Native img is more reliable for inline SVG data artwork than Next/Image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.fallbackSrc}
      alt={image.fallbackAlt || image.alt}
      loading="eager"
      decoding="async"
      className={cn("absolute inset-0 h-full w-full object-contain", className)}
    />
  );
}
