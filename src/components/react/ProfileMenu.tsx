'use client';

import { useState, useRef, useEffect } from 'react';
import { actions } from "astro:actions";
import { UserRound } from 'lucide-react';

interface UserInfo {
  userName?: string | null;
  userEmail?: string | null;
}

interface ProfileMenuProps {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  slugProfile: string;
}

export default function ProfileMenu({ userInfo, isLoggedIn, slugProfile: initialSlugProfile }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState(userInfo?.userName);
  const [slugProfile, setSlugProfile] = useState(initialSlugProfile);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const newName = event.detail.displayName;
      setUserName(newName);

      // Update slug/initials
      if (newName) {
        const initials = newName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setSlugProfile(initials);
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await actions.signOutAction();
      window.location.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Icon */}
      <button
        id="profile-button"
        aria-label="profile-config-button"
        onClick={toggleMenu}
        className="md:ml-3 bg-chart-1 p-2 rounded-full text-chart-2 dark:text-black hover:brightness-90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-chart-1"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <UserRound />
        </div>
      </button>

      {/* Profile Dropdown */}
      <ul
        id="profile-dropdown"
        className={`absolute w-80 z-20 shadow-2xl shadow-blue-200 dark:shadow-neutral-950 border border-blue-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white text-lg rounded-lg right-0 mt-2 text-left transition-all duration-200 ease-out transform ${isOpen
          ? 'opacity-100 scale-100 translate-y-0 visible'
          : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
          }`}
      >
        <li className="px-3 py-3 cursor-auto flex gap-x-2 items-center bg-chart-1">
          <span className="rounded-full bg-sidebar p-2 min-w-10 aspect-square text-accent-foreground flex items-center justify-center font-bold text-sm">
            {slugProfile}
          </span>
          <span className="mb-1 text-chart-2 truncate">
            {userName ?? userInfo?.userEmail}
          </span>
        </li>
        <li className="cursor-pointer border-b border-blue-200 dark:border-neutral-600">
          <a
            href="/miembros/perfil"
            data-astro-prefetch
            className="px-5 py-3 block w-full dark:hover:bg-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
          >
            Actualizar Perfil
          </a>
        </li>
        <li className="cursor-pointer">
          <button
            onClick={handleLogout}
            className="px-5 py-3 block w-full text-left dark:hover:bg-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
