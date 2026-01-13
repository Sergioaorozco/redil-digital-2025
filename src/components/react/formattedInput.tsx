import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PasswordInputProps {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

const formattedInput = ({ type = 'text', placeholder, autoComplete, name, id, required = false }: PasswordInputProps) => {
  const [isEyeVisible, setIsEyeVisible] = useState(false);

  const inputType = type === 'password'
    ? (isEyeVisible ? 'text' : 'password')
    : type;

  return (
    <div className="w-full">
      <div className="relative">
        <Input id={id} name={name} placeholder={placeholder} autoComplete={autoComplete} className="p-2.5 bg-neutral-50 border border-gray-500 text-neutral-900 rounded-lg block w-full dark:bg-neutral-700 dark:border-gray-400 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-600 focus:border-blue-600 pr-9" type={inputType} required={required}></Input>
        {type === 'password' && (
          <>
            <Button
              variant="ghost"
              className="h-full cursor-pointer text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
              size="icon"
              type="button"
              onClick={() => setIsEyeVisible(prevState => !prevState)}
            >
              {isEyeVisible ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default formattedInput;