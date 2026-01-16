'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useDocumentSecurity } from "@/hooks/use-document-security";

export function DocumentTabs() {
  // Track loading state for each tab independently
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    estatutos: true,
    reglamento: true,
  });

  const isSecureHidden = useDocumentSecurity();

  const handleLoad = (value: string) => {
    setLoadingMap((prev) => ({ ...prev, [value]: false }));
  };

  const estatutosUrl = "https://docs.google.com/document/d/1j0ngfgJIgkCHROXyXwnvYNNOORxRJQaq/preview";
  const reglamentoUrl = "https://docs.google.com/document/d/1UZWYobmsDfBZYnkqkJSSWniQ6h6QxyXp/preview";

  return (
    <Tabs defaultValue="estatutos" className="flex flex-col w-full md:px-0">
      <TabsList className="flex flex-row w-full bg-accent/30 p-1 md:h-auto">
        <TabsTrigger className="w-full py-4 text-center justify-center" value="estatutos">
          Estatutos
        </TabsTrigger>
        <TabsTrigger className="w-full py-4 text-center justify-center" value="reglamento">
          Reglamento
        </TabsTrigger>
      </TabsList>

      <TabsContent value="estatutos" className="w-full mt-5 relative min-h-[70vh]">
        {/* Skeleton overlays the iframe while loading */}
        {(loadingMap['estatutos'] || isSecureHidden) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <iframe
          src={estatutosUrl}
          className={`w-full h-[70vh] rounded-lg bg-white! print:hidden ${(loadingMap['estatutos'] || isSecureHidden) ? 'invisible' : ''}`}
          loading="lazy"
          onLoad={() => handleLoad('estatutos')}
        />
      </TabsContent>

      <TabsContent value="reglamento" className="w-full mt-5 relative h-full">
        {(loadingMap['reglamento'] || isSecureHidden) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <iframe
          src={reglamentoUrl}
          className={`w-full h-[70vh] rounded-lg bg-white! print:hidden ${(loadingMap['reglamento'] || isSecureHidden) ? 'invisible' : ''}`}
          loading="lazy"
          onLoad={() => handleLoad('reglamento')}
        />
      </TabsContent>
    </Tabs>
  );
}