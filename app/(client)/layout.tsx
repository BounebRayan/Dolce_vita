import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from '../../contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Dolce Vita - Luxury Home Collection",
  description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
};

const jost = Jost({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="fr">
      <CartProvider>
      <div className={`${jost.className} min-h-screen flex flex-col antialiased`}>
        <Header />
        <NavBar />
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
        <Footer />
      </div>
      </CartProvider>
    </div>
  );
}
