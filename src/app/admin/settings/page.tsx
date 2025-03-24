import { createClient } from "../../../../supabase/server";
import AdminSettings from "@/components/admin/admin-settings";

export const metadata = {
  title: "Admin Settings - SakanEgypt",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  // Fetch all admin settings
  const { data: settings, error } = await supabase
    .from("admin_settings")
    .select("*");

  // Format settings into a more usable structure
  const formattedSettings = (settings || []).reduce(
    (acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    },
    {} as Record<string, any>,
  );

  return <AdminSettings initialSettings={formattedSettings} />;
}
