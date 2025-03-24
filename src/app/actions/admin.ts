"use server";

import { createClient } from "../../../supabase/server";
import { isUserAdmin, logAdminAction } from "@/lib/admin-utils";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";

export const createUserAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be logged in");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return encodedRedirect(
      "error",
      "/",
      "You don't have permission to perform this action",
    );
  }

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const makeAdmin = formData.get("is_admin") === "true";

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/admin/users",
      "Email and password are required",
    );
  }

  try {
    // Create user in Auth
    const { data: userData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return encodedRedirect("error", "/admin/users", authError.message);
    }

    if (userData.user) {
      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: userData.user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: userData.user.id,
        token_identifier: userData.user.id,
        is_admin: makeAdmin,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        return encodedRedirect(
          "error",
          "/admin/users",
          "User created but profile creation failed",
        );
      }

      // Log admin action
      await logAdminAction(user.id, "create_user", "users", userData.user.id, {
        email,
        is_admin: makeAdmin,
      });

      return encodedRedirect(
        "success",
        "/admin/users",
        "User created successfully",
      );
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return encodedRedirect("error", "/admin/users", "Failed to create user");
  }
};

export const updateUserAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be logged in");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return encodedRedirect(
      "error",
      "/",
      "You don't have permission to perform this action",
    );
  }

  const userId = formData.get("user_id")?.toString();
  const fullName = formData.get("full_name")?.toString();
  const makeAdmin = formData.get("is_admin") === "true";

  if (!userId) {
    return encodedRedirect("error", "/admin/users", "User ID is required");
  }

  try {
    const updates: any = {};
    if (fullName) updates.full_name = fullName;
    if (fullName) updates.name = fullName;
    updates.is_admin = makeAdmin;

    // Update user profile
    const { error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user:", updateError);
      return encodedRedirect("error", "/admin/users", "Failed to update user");
    }

    // Log admin action
    await logAdminAction(user.id, "update_user", "users", userId, {
      updated_fields: Object.keys(updates),
    });

    return encodedRedirect(
      "success",
      "/admin/users",
      "User updated successfully",
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return encodedRedirect("error", "/admin/users", "Failed to update user");
  }
};

export const deleteUserAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be logged in");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return encodedRedirect(
      "error",
      "/",
      "You don't have permission to perform this action",
    );
  }

  const userId = formData.get("user_id")?.toString();

  if (!userId) {
    return encodedRedirect("error", "/admin/users", "User ID is required");
  }

  try {
    // Delete user from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Error deleting user from auth:", authError);
      return encodedRedirect(
        "error",
        "/admin/users",
        "Failed to delete user authentication",
      );
    }

    // Delete user profile
    const { error: profileError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return encodedRedirect(
        "error",
        "/admin/users",
        "User auth deleted but profile deletion failed",
      );
    }

    // Log admin action
    await logAdminAction(user.id, "delete_user", "users", userId);

    return encodedRedirect(
      "success",
      "/admin/users",
      "User deleted successfully",
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return encodedRedirect("error", "/admin/users", "Failed to delete user");
  }
};

export const updateSettingsAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be logged in");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return encodedRedirect(
      "error",
      "/",
      "You don't have permission to perform this action",
    );
  }

  try {
    // Extract all form data into a settings object
    const settings: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("setting_")) {
        const settingKey = key.replace("setting_", "");
        settings[settingKey] = value;
      }
    }

    // Update each setting
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return supabase.from("admin_settings").upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "setting_key",
        },
      );
    });

    await Promise.all(updatePromises);

    // Log admin action
    await logAdminAction(
      user.id,
      "update_settings",
      "admin_settings",
      undefined,
      { updated_keys: Object.keys(settings) },
    );

    return encodedRedirect(
      "success",
      "/admin/settings",
      "Settings updated successfully",
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    return encodedRedirect(
      "error",
      "/admin/settings",
      "Failed to update settings",
    );
  }
};
