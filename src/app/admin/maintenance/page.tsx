import { createClient } from "../../../../supabase/server";
import MaintenanceManagement from "@/components/admin/maintenance-management";

export const metadata = {
  title: "Maintenance Management - SakanEgypt Admin",
};

export default async function MaintenancePage() {
  const supabase = await createClient();

  // Fetch maintenance bookings with pagination
  const { data: bookings, error } = await supabase
    .from("maintenance_bookings")
    .select("*, users(name, email)")
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch maintenance categories
  const { data: categories } = await supabase
    .from("maintenance_categories")
    .select("*");

  return (
    <MaintenanceManagement
      initialBookings={bookings || []}
      categories={categories || []}
    />
  );
}
