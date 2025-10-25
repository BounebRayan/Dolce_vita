import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { CartProvider } from '../../contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Metadata for the client layout */
export const metadata: Metadata = {
  title: "Dolce Vita - Luxury Home Collection",
  description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
  keywords: "Dolce Vita, Meubles, Décoration, maison de luxe, Tunisie",
  authors: [{ name: "Rayan Bouneb", url: "https://github.com/BounebRayan" }],
  openGraph: {
    title: "Dolce Vita - Luxury Home Collection",
    description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Dolce Vita - Luxury Home Collection",
      },
    ],
    locale: "fr-FR",
    type: "website",
  },
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="fr">
      <CartProvider>
      <div className="min-h-screen flex flex-col antialiased font-normal">
        <Header />
        <div className="flex-grow"> 
            {children}
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false} 
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
              theme="light" 
            />
        </div>
        <Footer/>
      </div>
      </CartProvider>
    </div>
  );
}
