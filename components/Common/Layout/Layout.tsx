import { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from 'next-themes';

export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen dark:bg-gray-700 dark:text-white">
      <div className="max-w-screen-md px-4 py-12 mx-auto antialiased font-body">
        <Header />
        <main>{children}</main>
        <footer className="text-lg font-light">
          © {new Date().getFullYear()}, Built with{' '}
          <a href="https://nextjs.org/">Next.js</a>
          &#128293;
        </footer>
      </div>
    </div>
  );
}

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleDarkMode = checked => {
    const isDarkMode = checked;

    if (isDarkMode) setTheme('dark');
    else setTheme('light');
  };

  const isRoot = pathname === '/';
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <header
      className={clsx('flex items-center justify-between ', {
        'mb-8': isRoot,
        'mb-2': !isRoot,
      })}>
      <div className={'max-w-md'}>{isRoot ? <LargeTitle /> : <SmallTitle />}</div>
      {mounted && <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} />}
    </header>
  );
};

const LargeTitle = () => (
  <h1 style={{ paddingBottom: '0.5rem' }}>
    <Link href="/">
      <a
        className={clsx(
          'text-3xl font-black leading-none text-black no-underline font-display',
          'sm:text-5xl',
          'dark:text-white',
        )}>
        Home
      </a>
    </Link>
  </h1>
);

const SmallTitle = () => (
  <h1 style={{ paddingBottom: '0.5rem' }}>
    <Link href="/">
      <a
        className={clsx(
          'text-2xl font-black text-black no-underline font-display',
          'dark:text-white',
        )}>
        Home
      </a>
    </Link>
  </h1>
);
