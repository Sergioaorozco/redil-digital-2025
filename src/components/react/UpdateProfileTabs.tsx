'use-client';

// Icons
import { User, Lock, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

// Actions
import { actions } from "astro:actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormattedInput from "./formattedInput";

// Components
import { useState } from "react";

interface UpdateProfileTabsProps {
  initialName?: string;
  initialEmail?: string;
}

export function UpdateProfileTabs({ initialName = '', initialEmail = '' }: UpdateProfileTabsProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const updateFormData = new FormData(e.currentTarget);
      const { data, error } = await actions.updateProfileAction(updateFormData);

      if (error) {
        const message = error instanceof Error ? error.message : 'Error al actualizar el perfil';
        setErrorMsg(message);
        toast.error(message);
      }

      if (data) {
        const message = 'Perfil actualizado correctamente';
        setSuccessMsg(message);
        toast.success(message);

        // Dispatch custom event to notify other components (like Nav) to update
        window.dispatchEvent(new CustomEvent('profile-updated', {
          detail: { displayName: name }
        }));
      }

    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }

  }

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const updatePasswordFormData = new FormData(e.currentTarget);
      const { data, error } = await actions.updatePasswordAction(updatePasswordFormData);

      if (error) {
        const message = error instanceof Error ? error.message : 'Error al actualizar la contraseña';
        setErrorMsg(message);
        toast.error(message);
      }

      if (data) {
        const message = 'Contraseña actualizada correctamente';
        setSuccessMsg(message);
        toast.success(message);
      }

    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tabs defaultValue="account" className="flex items-center px-5 md:px-0">
      <TabsList className="flex flex-row w-full md:w-1/2 bg-accent/30 p-1 md:h-auto">
        <TabsTrigger className="w-full py-4" value="account"><User />Cuenta</TabsTrigger>
        <TabsTrigger className="w-full py-4" value="password"><Lock />Contraseña</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="w-full md:w-1/2 py-5">
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" disabled readOnly value={initialEmail} />
            <p className="text-muted-foreground text-sm italic">Por seguridad, no se puede cambiar el email.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name"><User size={16} className="text-primary-title" /> Nombre</Label>
            <Input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" value={name} required />
          </div>
          <button type="submit" className="flex justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !name}>
            {isLoading && (
              <LoaderCircleIcon size={16} className="animate-spin text-background place-self-center" />
            )} <p>Actualizar Perfil</p>
          </button>
        </form>
      </TabsContent>
      <TabsContent value="password" className="w-full md:w-1/2 py-5">
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current_password"><Lock size={16} className="text-primary-title" /> Contraseña Actual</Label>
            <FormattedInput
              autoComplete="current-password"
              type="password"
              name="current_password"
              id="current_password"
              placeholder="Tu contraseña actual"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <FormattedInput
              autoComplete="new-password"
              type="password"
              name="password"
              id="password"
              placeholder="Digita tu nueva contraseña"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
            <FormattedInput
              autoComplete="new-password"
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              placeholder="Confirma tu nueva contraseña"
              required
            />
          </div>
          <button type="submit" className="flex justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
            {isLoading && (
              <LoaderCircleIcon size={16} className="animate-spin text-background place-self-center" />
            )} <p>Actualizar Contraseña</p>
          </button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
