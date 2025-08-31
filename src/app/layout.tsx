import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analizador Automático de Textos',
  description: 'Herramienta de análisis inteligente que evalúa ortografía, coherencia, claridad y propósito comunicativo de tus textos.',
  keywords: 'análisis de texto, ortografía, gramática, coherencia, claridad, escritura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}