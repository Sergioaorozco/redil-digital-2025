'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DocumentTabs() {
  // Track loading state for each tab independently
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({
    estatutos: true,
    reglamento: true,
  });

  useEffect(() => {
    const handleBeforePrint = () => {
      setLoadingMap((prev) => ({ ...prev, estatutos: true, reglamento: true }));
    };

    const handleAfterPrint = () => {
      setLoadingMap((prev) => ({ ...prev, estatutos: false, reglamento: false }));
    };

    const preventScreenshot = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) ||
        ((e.metaKey) && e.shiftKey && (e.key === '3' || e.key === '4'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setLoadingMap((prev) => ({ ...prev, estatutos: true, reglamento: true }));
        toast.error('Por razones de seguridad, las capturas de pantalla están deshabilitadas.');

        setTimeout(() => {
          setLoadingMap((prev) => ({ ...prev, estatutos: false, reglamento: false }));
        }, 2000);
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    window.addEventListener('keydown', preventScreenshot);
    window.addEventListener('keyup', preventScreenshot);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      window.removeEventListener('keydown', preventScreenshot);
      window.removeEventListener('keyup', preventScreenshot);
    };
  }, []);

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
        {loadingMap['estatutos'] && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <iframe
          src={estatutosUrl}
          className={`w-full h-[70vh] rounded-lg bg-white! print:hidden ${loadingMap['estatutos'] ? 'invisible' : ''}`}
          loading="lazy"
          onLoad={() => handleLoad('estatutos')}
        />
      </TabsContent>

      <TabsContent value="reglamento" className="w-full mt-5 relative h-full">
        {loadingMap['reglamento'] && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <iframe
          src={reglamentoUrl}
          className={`w-full h-[70vh] rounded-lg bg-white! print:hidden ${loadingMap['reglamento'] ? 'invisible' : ''}`}
          loading="lazy"
          onLoad={() => handleLoad('reglamento')}
        />
      </TabsContent>
    </Tabs>
  );
}