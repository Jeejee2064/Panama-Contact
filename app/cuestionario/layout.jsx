import '../globals.css';

export const metadata = {
  title: 'Cuestionario / Questionnaire — Panama Contact',
  robots: { index: false, follow: false },
};

export default function CuestionarioLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              if (localStorage.getItem('pcs-theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}`,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
