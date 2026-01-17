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
  isInvalid?: boolean;
}

const formattedInput = ({ type = 'text', placeholder, autoComplete, name, id, required = false, isInvalid }: PasswordInputProps) => {
  const [isEyeVisible, setIsEyeVisible] = useState(false);

  const inputType = type === 'password'
    ? (isEyeVisible ? 'text' : 'password')
    : type;

  return (
    <div className="w-full">
      <div className="relative">
        <Input id={id} name={name} placeholder={placeholder} autoComplete={autoComplete} className="" type={inputType} required={required} aria-invalid={isInvalid}></Input>
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