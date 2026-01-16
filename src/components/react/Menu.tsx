'use client';

import { useState, useEffect } from 'react';
import ProfileMenu from './ProfileMenu';

interface UserInfo {
  userName?: string | null;
  userEmail?: string | null;
}

interface MenuProps {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  slugProfile: string;
  logoSvg?: React.ReactNode;
  bgImageSrc: string;
}

export default function Menu({ isLoggedIn, userInfo, slugProfile, logoSvg, bgImageSrc }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Nuestra Iglesia', href: '/iglesia' },
    { label: 'Próximos Eventos', href: '/eventos' },
    { label: 'Ministerios', href: '/ministerios' },
    { label: 'Miembros', href: '/miembros' },
  ];

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="nav-button transition-all duration-200 special-nav-link"
        >
          Menú
        </button>

        <div className="max-sm:hidden lg:block">
          <a
            href="/ingreso"
            data-astro-prefetch
            className="special-nav-link nav-button md:transition-colors md:duration-100 sm:animate-none"
          >
            Membresía
          </a>
        </div>

        {isLoggedIn && (
          <ProfileMenu
            userInfo={userInfo}
            isLoggedIn={isLoggedIn}
            slugProfile={slugProfile}
          />
        )}
      </div>

      {/* SideBar Menu Section */}
      <section
        id="modalMenu"
        className={`fixed inset-0 z-50 flex transition-all duration-500 ease-in-out ${isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
          }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-200 dark:from-neutral-950 dark:to-neutral-700 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

        <figure
          className={`relative h-full max-lg:hidden bg-neutral-200 dark:bg-neutral-600 w-1/2 overflow-clip transition-all duration-700 delay-100 ease-out transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
        >
          <div className="absolute flex items-end justify-center w-full h-1/2 bottom-0 bg-gradient-to-t from-neutral-700/80 to-transparent z-10">
            <span className="text-white w-56 pb-24">
              {logoSvg}
            </span>
          </div>
          <img
            alt="Image of Redil Laureles"
            className="h-full w-full object-cover"
            src={bgImageSrc}
          />
        </figure>

        <article className="relative flex flex-col pl-10 pr-5 max-sm:py-8 py-5 w-full md:pr-20">
          <div className="flex flex-col h-full">
            <button
              onClick={() => setIsOpen(false)}
              className="nav-button menu transition-all duration-200 self-end cursor-pointer dark:text-neutral-200 bg-white dark:bg-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 px-4 py-2 rounded-lg"
              type="button"
            >
              Cerrar
            </button>

            <ul className="menu-list flex flex-col items-start mt-10">
              {menuItems.map((item, index) => (
                <li
                  key={item.href}
                  className={`special-nav-link transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                    }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <a
                    href={item.href}
                    data-astro-prefetch
                    referrerPolicy="no-referrer"
                    className="text-neutral-800 dark:text-neutral-300 text-3xl md:text-7xl font-bold py-3 hover:text-neutral-600 dark:hover:text-white transition-colors duration-200 block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </>
  );
}
