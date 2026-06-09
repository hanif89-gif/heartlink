import AdminSidebar from "@/app/components/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | HeartLink",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AdminSidebar />
      
      {/* Content wrapper — pushed right by the fixed 256px sidebar */}
      <div style={{ marginLeft: "256px" }}>
        <main style={{ minHeight: "100vh", padding: "32px", backgroundColor: "#f8fafc" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
