import { createClient } from "../../../../supabase/server";
import PropertyManagement from "@/components/admin/property-management";

export const metadata = {
  title: "Property Management - SakanEgypt Admin",
};

export default async function PropertiesPage() {
  const supabase = await createClient();

  // Fetch properties with pagination
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <PropertyManagement initialProperties={properties || []} />;
}
