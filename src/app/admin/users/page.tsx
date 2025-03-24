import { createClient } from "../../../../supabase/server";
import UserManagement from "@/components/admin/user-management";

export const metadata = {
  title: "User Management - SakanEgypt Admin",
};

export default async function UsersPage() {
  const supabase = await createClient();

  // Fetch users with pagination
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <UserManagement initialUsers={users || []} />;
}
