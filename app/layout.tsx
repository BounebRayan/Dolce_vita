import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import localFont from 'next/font/local';
import { CartProvider } from '../contexts/CartContext';

const myFont = localFont({
  src: [
    { path: '/fonts/BrandonText-Thin.otf', weight: '100', style: 'normal' },
    { path: '/fonts/BrandonText-Light.otf', weight: '300', style: 'normal' },
    { path: '/fonts/BrandonText-Regular.otf', weight: '400', style: 'normal' },
    { path: '/fonts/BrandonText-Bold.otf', weight: '700', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  title: "Dolce Vita - Luxury Home Collection",
  description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
};

const jost = Jost({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <CartProvider>
      <body className={`${jost.className} ${myFont.className} min-h-screen flex flex-col antialiased`}>
        <Header />
        <NavBar />
        <main className="flex-grow">
          
            {children}
          
        </main>
        <Footer />
      </body>
      </CartProvider>
    </html>
  );
}
