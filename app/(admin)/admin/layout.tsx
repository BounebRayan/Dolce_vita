import AdminHeader from "@/components/AdminHeader";
import AdminNavbar from "@/components/AdminNavBar";
import "../../globals.css";
import io from 'socket.io-client';

const socket = io();
export const metadata = {
    title: "Admin Panel - Dolce Vita",
    description: "Manage products and orders.",
};

export default function AdminLayout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
            <div className="min-h-screen flex flex-col antialiased bg-gray-100">
                <AdminHeader />
                <AdminNavbar />
                <main className="flex-grow">{children}</main>
            </div>
    );
}
