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
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the database query
    let dbQuery = supabase.from("furniture").select("*", { count: "exact" });

    // Apply filters if provided
    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    if (category) {
      dbQuery = dbQuery.eq("category", category);
    }

    if (minPrice) {
      dbQuery = dbQuery.gte("price_numeric", parseInt(minPrice));
    }

    if (maxPrice) {
      dbQuery = dbQuery.lte("price_numeric", parseInt(maxPrice));
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
      furniture: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching furniture:", error);
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

    const { action, furnitureId, furnitureData } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case "create":
        if (!furnitureData) {
          return NextResponse.json(
            { error: "Furniture data is required for creation" },
            { status: 400 },
          );
        }

        // Ensure price_numeric is set if price is provided
        if (furnitureData.price && !furnitureData.price_numeric) {
          const priceNumeric = parseInt(
            furnitureData.price.replace(/[^0-9]/g, ""),
          );
          if (!isNaN(priceNumeric)) {
            furnitureData.price_numeric = priceNumeric;
          }
        }

        // Create new furniture item
        const { data: createData, error: createError } = await supabase
          .from("furniture")
          .insert(furnitureData)
          .select()
          .single();

        if (createError) throw createError;
        result = createData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "create_furniture",
          "furniture",
          createData.id,
          { furniture_title: furnitureData.title },
        );
        break;

      case "update":
        if (!furnitureId || !furnitureData) {
          return NextResponse.json(
            { error: "Furniture ID and data are required for update" },
            { status: 400 },
          );
        }

        // Ensure price_numeric is updated if price is changed
        if (furnitureData.price && !furnitureData.price_numeric) {
          const priceNumeric = parseInt(
            furnitureData.price.replace(/[^0-9]/g, ""),
          );
          if (!isNaN(priceNumeric)) {
            furnitureData.price_numeric = priceNumeric;
          }
        }

        // Update furniture item
        const { data: updateData, error: updateError } = await supabase
          .from("furniture")
          .update(furnitureData)
          .eq("id", furnitureId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "update_furniture",
          "furniture",
          furnitureId,
          { updated_fields: Object.keys(furnitureData) },
        );
        break;

      case "delete":
        if (!furnitureId) {
          return NextResponse.json(
            { error: "Furniture ID is required for deletion" },
            { status: 400 },
          );
        }

        // Delete furniture item
        const { error: deleteError } = await supabase
          .from("furniture")
          .delete()
          .eq("id", furnitureId);

        if (deleteError) throw deleteError;
        result = {
          success: true,
          message: "Furniture item deleted successfully",
        };

        // Log the admin action
        await logAdminAction(
          user.id,
          "delete_furniture",
          "furniture",
          furnitureId,
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error managing furniture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
