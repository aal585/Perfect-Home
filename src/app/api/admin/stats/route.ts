import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import { isUserAdmin } from "@/lib/admin-utils";

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
    const period = searchParams.get("period") || "week"; // day, week, month, year

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const startDateStr = startDate.toISOString();

    // Fetch various statistics in parallel
    const [
      usersResponse,
      propertiesResponse,
      furnitureResponse,
      maintenanceResponse,
      newUsersResponse,
      newPropertiesResponse,
      newBookingsResponse,
      activeUsersResponse,
    ] = await Promise.all([
      // Total counts
      supabase.from("users").select("count", { count: "exact" }),
      supabase.from("properties").select("count", { count: "exact" }),
      supabase.from("furniture").select("count", { count: "exact" }),
      supabase.from("maintenance_bookings").select("count", { count: "exact" }),

      // New items in period
      supabase
        .from("users")
        .select("count", { count: "exact" })
        .gte("created_at", startDateStr),
      supabase
        .from("properties")
        .select("count", { count: "exact" })
        .gte("created_at", startDateStr),
      supabase
        .from("maintenance_bookings")
        .select("count", { count: "exact" })
        .gte("created_at", startDateStr),

      // Active users (users with browsing history in period)
      supabase
        .from("browsing_history")
        .select("user_id")
        .gte("viewed_at", startDateStr)
        .limit(1000),
    ]);

    // Calculate active users (unique user IDs)
    const activeUserIds = new Set();
    if (activeUsersResponse.data) {
      activeUsersResponse.data.forEach((item) => {
        if (item.user_id) activeUserIds.add(item.user_id);
      });
    }

    // Fetch recent activity
    const { data: recentActivity } = await supabase
      .from("admin_logs")
      .select("*, users(name)")
      .order("created_at", { ascending: false })
      .limit(10);

    // Compile statistics
    const stats = {
      totals: {
        users: usersResponse.count || 0,
        properties: propertiesResponse.count || 0,
        furniture: furnitureResponse.count || 0,
        maintenance: maintenanceResponse.count || 0,
      },
      period: {
        newUsers: newUsersResponse.count || 0,
        newProperties: newPropertiesResponse.count || 0,
        newBookings: newBookingsResponse.count || 0,
        activeUsers: activeUserIds.size,
      },
      recentActivity: recentActivity || [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
