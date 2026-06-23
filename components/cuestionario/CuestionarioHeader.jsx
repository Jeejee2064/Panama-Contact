import ThemeToggle from './ThemeToggle';

export default function CuestionarioHeader() {
  return (
    <header className="bg-black dark:bg-gray-900 py-5 px-6 md:py-6 md:px-10 flex items-center justify-between transition-colors">
      <img src="/logo-blanc.avif" alt="Panama Contact" className="h-10 md:h-14 object-contain" />
      <ThemeToggle />
    </header>
  );
}
