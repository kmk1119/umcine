"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
}

// onError로 실패한 이미지를 대체 화면으로 바꾸므로 Client Component다.
export function MovieImage({ src, alt, className, width, height, sizes, priority = false }: MovieImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || src === failedSrc) {
    return <div role="img" aria-label={alt || "배경 이미지 없음"}
      className={cn("flex items-center justify-center bg-gray-200 text-sm text-gray-600", className)}>이미지 없음</div>;
  }
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} preload={priority}
    className={className} onError={() => setFailedSrc(src)} />;
}
