'use-client';

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";

const passwordInput = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="w-full">
      <div className="relative">
        <Input placeholder="digita tu contraseña" autoComplete="current-password" className="p-2.5 bg-neutral-50 border border-gray-500 text-neutral-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full dark:bg-neutral-700 dark:border-gray-400 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-9" name="password" id="password" type={isVisible ? "text" : "password"} required></Input>
        <Button
          variant="ghost"
          className="h-full cursor-pointer text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
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