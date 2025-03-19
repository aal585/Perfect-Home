import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const propertyType = searchParams.get("propertyType");

    // Build the database query
    let dbQuery = supabase.from("properties").select("*");

    // Apply filters if provided
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
    }

    if (minPrice) {
      dbQuery = dbQuery.gte("price_numeric", parseInt(minPrice));
    }

    if (maxPrice) {
      dbQuery = dbQuery.lte("price_numeric", parseInt(maxPrice));
    }

    if (bedrooms) {
      dbQuery = dbQuery.gte("beds", parseInt(bedrooms));
    }

    if (propertyType) {
      dbQuery = dbQuery.eq("property_type", propertyType);
    }

    // Execute the query
    const { data, error } = await dbQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({ properties: data });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
