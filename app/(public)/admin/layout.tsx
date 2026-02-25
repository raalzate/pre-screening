import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const sofkaColors = {
  blue: '#002C5E',
  lightBlue: '#0083B3',
  orange: '#FF5C00',
  gray: '#F3F4F6',
  darkGray: '#4B5563',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image
              src="https://sofka.com.co/static/logo.svg"
              alt="Sofka Technologies Logo"
              width={120}
              height={30}
              priority
            />
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4 text-sm" style={{ color: sofkaColors.darkGray }}>
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.
        </div>
      </footer>
    </AuthProvider>
  );
}
