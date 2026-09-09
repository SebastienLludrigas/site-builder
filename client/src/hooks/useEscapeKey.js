import { useEffect } from 'react';

/**
 * Calls onClose when Escape is pressed while isOpen is true.
 * Shared by every modal/drawer so closing behavior stays consistent app-wide.
 */
export function useEscapeKey(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}
