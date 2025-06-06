
import "./globals.css";
import Navbar from "@/components/nav";
import ProtectedRoute from "@/components/protection";


export const metadata = {
  title: "IOTechz",
  description: "IOTechz - Your IoT Solutions Partner",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className="font-sans antialiased max-w-screen overflow-x-hidden bg-slate-100">
      <ProtectedRoute>
          <Navbar user={null} />
          {children}
      </ProtectedRoute>
        </body>
    </html>
  );
}
