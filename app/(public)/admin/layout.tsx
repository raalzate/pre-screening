import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/AdminHeader";

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
      <Header />
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4 text-sm" style={{ color: sofkaColors.darkGray }}>
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} Sofka Technologies. All Rights Reserved.
        </div>
      </footer>
    </AuthProvider>
  );
}
