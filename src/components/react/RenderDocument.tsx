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
    <div className="relative w-full h-[70vh]">
      {showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
      )}
      <iframe
        src={url}
        title="Visualizador de documento"
        className={`w-full h-full rounded-lg bg-white! print:hidden transition-all duration-500 ${showSkeleton ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        referrerPolicy="origin"
        onLoad={handleLoad}
      />
    </div>
  );
}