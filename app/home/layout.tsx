import React, { ReactNode } from "react";
import "../../app/globals.css"; // global CSS import
import Header from "../component/header";
import Footer from "../component/footer";

export const metadata = {
  title: "My Next.js Website",
  description: "This is my awesome Next.js website",
};

// Props type for layout
type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Metadata handled by Next.js automatically */}
      </head>
      <body>
        {/* Header */}
    <Header/>
    

        {/* Main content */}
        <main className="" >{children}</main>

        {/* Footer */}
<Footer/>        
      </body>
    </html>
  );
}
