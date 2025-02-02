import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CartProvider } from '../../contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer2 from "@/components/Footer2";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Dolce Vita - Luxury Home Collection",
  description: "Rejoignez-nous pour une expérience de décoration unique et inspirante!",
};

const jost = Jost({ subsets: ["latin"] });

const myFont4 = localFont({
  src: [
    { path: '../fonts/Satochi/Satoshi-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/Satochi/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/Satochi/Satoshi-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/Satochi/Satoshi-Bold.otf', weight: '700', style: 'normal' },
  ],
});



export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="fr">
      <CartProvider>
      <div className={`${myFont4.className} min-h-screen flex flex-col antialiased font-normal `}>
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
        <Footer2/>
      </div>
      </CartProvider>
    </div>
  );
}
