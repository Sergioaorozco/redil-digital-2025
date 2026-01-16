import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useDocumentSecurity() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleBeforePrint = () => {
      setIsHidden(true);
    };

    const handleAfterPrint = () => {
      setIsHidden(false);
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
        setIsHidden(true);
        toast.error('Por razones de seguridad, las capturas de pantalla están deshabilitadas.');

        // Hide content for 2 seconds to deter the screenshot attempt, then restore.
        setTimeout(() => {
          setIsHidden(false);
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

  return isHidden;
}
