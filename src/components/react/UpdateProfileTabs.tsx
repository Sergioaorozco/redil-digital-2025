'use-client';

// Icons
import { User, Lock } from "lucide-react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormattedInput from "./formattedInput";

interface UpdateProfileTabsProps {
  initialName?: string;
  initialEmail?: string;
}

export function UpdateProfileTabs({ initialName = '', initialEmail = '' }: UpdateProfileTabsProps) {
  return (
    <Tabs defaultValue="account" className="flex items-center px-5 md:px-0">
      <TabsList className="flex flex-row w-full md:w-1/2 bg-accent/30 p-1 md:h-auto">
        <TabsTrigger className="w-full py-4" value="account"><User />Cuenta</TabsTrigger>
        <TabsTrigger className="w-full py-4" value="password"><Lock />Contraseña</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="w-full md:w-1/2 py-5">
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" disabled readOnly value={initialEmail} />
            <p className="text-muted-foreground text-sm">Aún no es posible cambiar el email. Contacta a un administrador para hacerlo.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input type="text" name="name" id="name" value={initialName} />
          </div>
          <button type="submit" className="btn-primary">Actualizar Perfil</button>
        </form>
      </TabsContent>
      <TabsContent value="password" className="w-full md:w-1/2 py-5">
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <FormattedInput
              autoComplete="new-password"
              type="password"
              name="password"
              id="password"
              placeholder="Digita tu Contraseña"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
            <FormattedInput
              autoComplete="new-password"
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Digita tu Contraseña"
              required
            />
          </div>
          <button type="submit" className="btn-primary">Actualizar Contraseña</button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
