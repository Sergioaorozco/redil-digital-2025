'use client';

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentSecurity } from "@/hooks/use-document-security";

interface RenderDocumentProps {
  url: string;
}

export function RenderDocument({ url }: RenderDocumentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isSecureHidden = useDocumentSecurity();

  const handleLoad = () => {
    setIsLoading(false);
  };

  const showSkeleton = isLoading || isSecureHidden;

  return (
    <div className="relative w-full h-[calc(100vh-18rem)]">
      {showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
      )}
      <iframe
        src={url}
        className={`w-full h-full rounded-lg bg-white! print:hidden ${showSkeleton ? 'invisible' : ''}`}
        loading="lazy"
        onLoad={handleLoad}
      />
    </div>
  );
}