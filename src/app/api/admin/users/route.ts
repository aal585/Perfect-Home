import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import { isUserAdmin, logAdminAction } from "@/lib/admin-utils";

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the database query
    let dbQuery = supabase.from("users").select("*", { count: "exact" });

    // Apply search filter if provided
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,email.ilike.%${query}%,full_name.ilike.%${query}%`,
      );
    }

    // Apply pagination
    dbQuery = dbQuery
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    // Execute the query
    const { data, error, count } = await dbQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      users: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
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

    const { action, userId, userData } = await request.json();

    if (!action || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case "update":
        if (!userData) {
          return NextResponse.json(
            { error: "User data is required for update" },
            { status: 400 },
          );
        }

        // Update user data
        const { data: updateData, error: updateError } = await supabase
          .from("users")
          .update(userData)
          .eq("id", userId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateData;

        // Log the admin action
        await logAdminAction(user.id, "update_user", "users", userId, {
          updated_fields: Object.keys(userData),
        });
        break;

      case "delete":
        // Delete user
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("id", userId);

        if (deleteError) throw deleteError;
        result = { success: true, message: "User deleted successfully" };

        // Log the admin action
        await logAdminAction(user.id, "delete_user", "users", userId);
        break;

      case "toggle_admin":
        // Toggle admin status
        const { data: currentUser } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", userId)
          .single();

        const newAdminStatus = !currentUser?.is_admin;

        const { data: toggleData, error: toggleError } = await supabase
          .from("users")
          .update({ is_admin: newAdminStatus })
          .eq("id", userId)
          .select()
          .single();

        if (toggleError) throw toggleError;
        result = toggleData;

        // Log the admin action
        await logAdminAction(
          user.id,
          newAdminStatus ? "grant_admin" : "revoke_admin",
          "users",
          userId,
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error managing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
