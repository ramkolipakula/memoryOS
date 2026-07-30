import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* TopAppBar (Mobile & Web) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-background dark:bg-background border-b border-outline-variant bg-background/80 backdrop-blur-md">
        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-variant">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>memory</span>
        </button>
        <h1 className="font-display text-headline-md-mobile text-primary tracking-tighter">MemoryOS</h1>
        <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-variant">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>sensors</span>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow pt-24 px-gutter pb-safe max-w-container-max mx-auto w-full md:pl-[280px]">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-safe px-2 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg rounded-t-xl h-[72px]">
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="#">
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="#">
          <span className="material-symbols-outlined mb-1">account_tree</span>
          <span className="font-label-md text-label-md">Pipeline</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="#">
          <span className="material-symbols-outlined mb-1">psychology</span>
          <span className="font-label-md text-label-md">Reasoning</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="#">
          <span className="material-symbols-outlined mb-1">search</span>
          <span className="font-label-md text-label-md">Search</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary" href="#">
          <span className="material-symbols-outlined mb-1">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </a>
      </nav>

      {/* NavigationDrawer (Web Only) */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-[60] flex-col p-md h-full w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant shadow-xl">
        <div className="mb-8 px-2 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px]">memory</span>
          <span className="font-display text-primary text-headline-md tracking-tighter">MemoryOS</span>
        </div>
        <nav className="flex flex-col gap-2">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-tertiary font-bold bg-tertiary-container/10" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors" href="#">
            <span className="material-symbols-outlined">account_tree</span>
            <span className="font-body-md text-body-md">Pipeline</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors" href="#">
            <span className="material-symbols-outlined">psychology</span>
            <span className="font-body-md text-body-md">Reasoning</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors" href="#">
            <span className="material-symbols-outlined">search</span>
            <span className="font-body-md text-body-md">Search</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors mt-auto" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
      </aside>
    </>
  );
}
