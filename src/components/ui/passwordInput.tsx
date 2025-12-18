'use-client';

import { EyeIcon, EyeOffIcon, Ghost } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { useId, useState } from "react";

const passwordInput = () => {
  const [ isVisible, setIsVisible] = useState(false);
  const pswId = useId();
  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="relative">
        <Input placeholder="digita tu contraseña" className="pr-9" name="password" id="password" type={isVisible ? "text" : "password"} required></Input>
        <Button
          variant="ghost"
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
          size="icon"
          type="button"
          onClick={() => setIsVisible(prevState => !prevState)}
        >
          {isVisible ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
        <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
      </div>
    </div>
  )
}

export default passwordInput