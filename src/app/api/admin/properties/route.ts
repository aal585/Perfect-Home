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
    const propertyType = searchParams.get("propertyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the database query
    let dbQuery = supabase.from("properties").select("*", { count: "exact" });

    // Apply filters if provided
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
    }

    if (propertyType) {
      dbQuery = dbQuery.eq("property_type", propertyType);
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
      properties: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
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

    const { action, propertyId, propertyData } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 },
      );
    }

    let result;

    switch (action) {
      case "create":
        if (!propertyData) {
          return NextResponse.json(
            { error: "Property data is required for creation" },
            { status: 400 },
          );
        }

        // Ensure price_numeric is set if price is provided
        if (propertyData.price && !propertyData.price_numeric) {
          const priceNumeric = parseInt(
            propertyData.price.replace(/[^0-9]/g, ""),
          );
          if (!isNaN(priceNumeric)) {
            propertyData.price_numeric = priceNumeric;
          }
        }

        // Create new property
        const { data: createData, error: createError } = await supabase
          .from("properties")
          .insert(propertyData)
          .select()
          .single();

        if (createError) throw createError;
        result = createData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "create_property",
          "properties",
          createData.id,
          { property_title: propertyData.title },
        );
        break;

      case "update":
        if (!propertyId || !propertyData) {
          return NextResponse.json(
            { error: "Property ID and data are required for update" },
            { status: 400 },
          );
        }

        // Ensure price_numeric is updated if price is changed
        if (propertyData.price && !propertyData.price_numeric) {
          const priceNumeric = parseInt(
            propertyData.price.replace(/[^0-9]/g, ""),
          );
          if (!isNaN(priceNumeric)) {
            propertyData.price_numeric = priceNumeric;
          }
        }

        // Update property
        const { data: updateData, error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", propertyId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateData;

        // Log the admin action
        await logAdminAction(
          user.id,
          "update_property",
          "properties",
          propertyId,
          { updated_fields: Object.keys(propertyData) },
        );
        break;

      case "delete":
        if (!propertyId) {
          return NextResponse.json(
            { error: "Property ID is required for deletion" },
            { status: 400 },
          );
        }

        // Delete property
        const { error: deleteError } = await supabase
          .from("properties")
          .delete()
          .eq("id", propertyId);

        if (deleteError) throw deleteError;
        result = { success: true, message: "Property deleted successfully" };

        // Log the admin action
        await logAdminAction(
          user.id,
          "delete_property",
          "properties",
          propertyId,
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error managing property:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
