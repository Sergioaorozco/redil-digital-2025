'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentSecurity } from "@/hooks/use-document-security";
import { RenderDocument } from "./RenderDocument";

export function DocumentTabs() {
  const isSecureHidden = useDocumentSecurity();
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
        {(isSecureHidden) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <RenderDocument url={estatutosUrl} />
      </TabsContent>

      <TabsContent value="reglamento" className="w-full mt-5 relative h-full">
        {(isSecureHidden) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg z-10" />
        )}
        <RenderDocument url={reglamentoUrl} />
      </TabsContent>
    </Tabs>
  );
}