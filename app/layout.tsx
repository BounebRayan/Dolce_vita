
import localFont from 'next/font/local';

const myFont = localFont({
    src: [
      { path: '/fonts/BrandonText-Thin.otf', weight: '100', style: 'normal' },
      { path: '/fonts/BrandonText-Light.otf', weight: '300', style: 'normal' },
      { path: '/fonts/BrandonText-Regular.otf', weight: '400', style: 'normal' },
      { path: '/fonts/BrandonText-Bold.otf', weight: '700', style: 'normal' },
    ],
  });


export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <body className={`${myFont.className} min-h-screen flex flex-col antialiased`}>{children}</body>
        
      </html>
    );
  }