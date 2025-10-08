import '../styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Sistema de Reservas | Reserva fácil y rápido',
  description: 'Plataforma moderna para reservar salas de reuniones y estacionamientos. Interfaz intuitiva y gestión eficiente.',
  keywords: 'reservas, salas, estacionamiento, corporativo, gestión',
  authors: [{ name: 'Sistema Reservas' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
