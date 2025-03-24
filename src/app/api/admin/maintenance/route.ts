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
    const serviceType = searchParams.get("serviceType");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the database query
    let dbQuery = supabase
      .from("maintenance_bookings")
      .select("*, users!inner(name, email)", { count: "exact" });

    // Apply filters if provided
    if (serviceType) {
      dbQuery = dbQuery.eq("service_type", serviceType);
    }

    if (status) {
      dbQuery = dbQuery.eq("status", status);
    }

    if (startDate) {
      dbQuery = dbQuery.gte("booking_date", startDate);
    }

    if (endDate) {
      dbQuery = dbQuery.lte("booking_date", endDate);
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
      bookings: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching maintenance bookings:", error);
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

    const { action, bookingId, bookingData, categoryData, categoryId } =
      await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case "update_booking":
        if (!bookingId || !bookingData) {
          return NextResponse.json(
            { error: "Booking ID and data are required for update" },
            { status: 400 },
          );
        }

        // Update booking
        const { data: updateData, error: updateError } = await supabase
          .from("maintenance_bookings")
          .update(bookingData)
          .eq("id", bookingId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "update_maintenance_booking",
          "maintenance_bookings",
          bookingId,
          { updated_fields: Object.keys(bookingData) },
        );
        break;

      case "delete_booking":
        if (!bookingId) {
          return NextResponse.json(
            { error: "Booking ID is required for deletion" },
            { status: 400 },
          );
        }

        // Delete booking
        const { error: deleteError } = await supabase
          .from("maintenance_bookings")
          .delete()
          .eq("id", bookingId);

        if (deleteError) throw deleteError;
        result = { success: true, message: "Booking deleted successfully" };

        // Log the admin action
        await logAdminAction(
          user.id,
          "delete_maintenance_booking",
          "maintenance_bookings",
          bookingId,
        );
        break;

      case "create_category":
        if (!categoryData) {
          return NextResponse.json(
            { error: "Category data is required for creation" },
            { status: 400 },
          );
        }

        // Create new category
        const { data: createCategoryData, error: createCategoryError } =
          await supabase
            .from("maintenance_categories")
            .insert(categoryData)
            .select()
            .single();

        if (createCategoryError) throw createCategoryError;
        result = createCategoryData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "create_maintenance_category",
          "maintenance_categories",
          createCategoryData.id,
          { category_title: categoryData.title },
        );
        break;

      case "update_category":
        if (!categoryId || !categoryData) {
          return NextResponse.json(
            { error: "Category ID and data are required for update" },
            { status: 400 },
          );
        }

        // Update category
        const { data: updateCategoryData, error: updateCategoryError } =
          await supabase
            .from("maintenance_categories")
            .update(categoryData)
            .eq("id", categoryId)
            .select()
            .single();

        if (updateCategoryError) throw updateCategoryError;
        result = updateCategoryData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "update_maintenance_category",
          "maintenance_categories",
          categoryId,
          { updated_fields: Object.keys(categoryData) },
        );
        break;

      case "delete_category":
        if (!categoryId) {
          return NextResponse.json(
            { error: "Category ID is required for deletion" },
            { status: 400 },
          );
        }

        // Delete category
        const { error: deleteCategoryError } = await supabase
          .from("maintenance_categories")
          .delete()
          .eq("id", categoryId);

        if (deleteCategoryError) throw deleteCategoryError;
        result = { success: true, message: "Category deleted successfully" };

        // Log the admin action
        await logAdminAction(
          user.id,
          "delete_maintenance_category",
          "maintenance_categories",
          categoryId,
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error managing maintenance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
