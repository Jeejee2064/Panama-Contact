import '../globals.css';

export const metadata = {
  title: 'Cuestionario / Questionnaire — Panama Contact',
  robots: { index: false, follow: false },
};

export default function CuestionarioLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
