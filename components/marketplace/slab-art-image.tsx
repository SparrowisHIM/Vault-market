"use client";

import Image from "next/image";
import { useState } from "react";
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
  sizes,
  priority = false,
  className,
}: SlabArtImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const shouldRenderFallback = useFallback || image.src === image.fallbackSrc;

  if (shouldRenderFallback) {
    return (
      <Image
        src={image.fallbackSrc}
        alt={image.fallbackAlt}
        fill
        sizes={sizes}
        unoptimized
        priority={priority}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      unoptimized
      priority={priority}
      onError={() => setUseFallback(true)}
      className={cn("object-contain", className)}
    />
  );
}
