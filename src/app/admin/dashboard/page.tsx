import { createClient } from "../../../../supabase/server";
import AdminDashboard from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Admin Dashboard - SakanEgypt",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch summary statistics
  const [
    usersResponse,
    propertiesResponse,
    furnitureResponse,
    maintenanceResponse,
  ] = await Promise.all([
    supabase.from("users").select("count", { count: "exact" }),
    supabase.from("properties").select("count", { count: "exact" }),
    supabase.from("furniture").select("count", { count: "exact" }),
    supabase.from("maintenance_bookings").select("count", { count: "exact" }),
  ]);

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("admin_logs")
    .select("*, users(name, email)")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = {
    users: usersResponse.count || 0,
    properties: propertiesResponse.count || 0,
    furniture: furnitureResponse.count || 0,
    maintenance: maintenanceResponse.count || 0,
  };

  return <AdminDashboard stats={stats} recentActivity={recentActivity || []} />;
}
