import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { CartProvider } from '../../contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Dolce Vita - Luxury Home Collection",
  description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
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
