import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build the database query
    let dbQuery = supabase.from("furniture").select("*");

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

    // Execute the query
    const { data, error } = await dbQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({ furniture: data });
  } catch (error) {
    console.error("Error fetching furniture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
