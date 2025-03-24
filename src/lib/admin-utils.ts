import { createClient } from "../../supabase/server";

/**
 * Check if a user is an admin
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return !!data.is_admin;
}

/**
 * Log an admin action
 * @param adminId The admin user ID
 * @param action The action performed
 * @param entityType The type of entity affected
 * @param entityId The ID of the entity affected (optional)
 * @param details Additional details about the action (optional)
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: any,
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("admin_logs").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

/**
 * Get admin settings
 * @param key The setting key to retrieve
 * @returns The setting value or null if not found
 */
export async function getAdminSetting(key: string): Promise<any | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_settings")
    .select("setting_value")
    .eq("setting_key", key)
    .single();

  if (error || !data) return null;
  return data.setting_value;
}

/**
 * Update admin settings
 * @param key The setting key to update
 * @param value The new setting value
 * @param userId The ID of the user making the update
 */
export async function updateAdminSetting(
  key: string,
  value: any,
  userId: string,
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("admin_settings").upsert(
    {
      setting_key: key,
      setting_value: value,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "setting_key",
    },
  );
}
