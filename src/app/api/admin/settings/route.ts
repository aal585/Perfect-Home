import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import {
  isUserAdmin,
  logAdminAction,
  updateAdminSetting,
} from "@/lib/admin-utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all settings
    const { data, error } = await supabase.from("admin_settings").select("*");

    if (error) {
      throw error;
    }

    // Format settings into a more usable structure
    const formattedSettings = (data || []).reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json({ settings: formattedSettings });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { settings } = await request.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "Settings object is required" },
        { status: 400 },
      );
    }

    // Update each setting
    const updatePromises = Object.entries(settings).map(([key, value]) =>
      updateAdminSetting(key, value, user.id),
    );

    await Promise.all(updatePromises);

    // Log the admin action
    await logAdminAction(
      user.id,
      "update_settings",
      "admin_settings",
      undefined,
      { updated_keys: Object.keys(settings) },
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
