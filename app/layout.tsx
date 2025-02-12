
import localFont from 'next/font/local';

const satoshi = localFont({
  src: [
    { path: '../public/fonts/Satoshi/Satoshi-Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/Satoshi/Satoshi-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Satoshi/Satoshi-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Satoshi/Satoshi-Bold.otf', weight: '700', style: 'normal' },
  ],
});

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <body className={`${satoshi.className} min-h-screen flex flex-col subpixel-antialiased`}>
          {children}
        </body>  
      </html>
    );
  }