import AdminHeader from "@/components/Admin/AdminHeader";
import AdminNavbar from "@/components/Admin/AdminNavBar";
import "../../globals.css";
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
