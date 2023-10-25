import React from 'react'
import { Avatar } from '@consta/uikit/Avatar';
export const Header = () => {
  return (
    <header className="bg-zinc-900 text-white shadow-xl absolute inset-y-0 left-0 w-16 top-0 z-10">
        <section className="max-w-screen-lg mx-auto p-4 flex justify-between items-center">
          <h1 className="text-1xl font-medium font-monospace">
            <a href="#hero">📚</a>
          </h1>
          <div>
            <button
              id="mobile-open-button"
              className="text-3x1 sm:hidden focus:outline-none"
            >
              &#9776;
            </button>
            <nav
              className="hidden sm:block space-x-8 text-xl"
              aria-label="main"
            >
            </nav>
          </div>
          <Avatar name="Куст Геннадий Альбертович" />
        </section>
      </header>
  )
}