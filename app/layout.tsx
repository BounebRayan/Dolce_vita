import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";


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
      <body className={`${jost.className} antialiased`}>
        <Header/>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
