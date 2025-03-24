import { createClient } from "../../../../supabase/server";
import FurnitureManagement from "@/components/admin/furniture-management";

export const metadata = {
  title: "Furniture Management - SakanEgypt Admin",
};

export default async function FurniturePage() {
  const supabase = await createClient();

  // Fetch furniture items with pagination
  const { data: furniture, error } = await supabase
    .from("furniture")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <FurnitureManagement initialFurniture={furniture || []} />;
}
