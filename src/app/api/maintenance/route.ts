import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const serviceType = searchParams.get("serviceType");
    const location = searchParams.get("location");

    // Build the database query
    let dbQuery = supabase.from("maintenance").select("*");

    // Apply filters if provided
    if (serviceType) {
      dbQuery = dbQuery.eq("service_type", serviceType);
    }

    if (location) {
      dbQuery = dbQuery.eq("location", location);
    }

    // Execute the query
    const { data, error } = await dbQuery;

    if (error) {
      throw error;
    }

    return NextResponse.json({ services: data });
  } catch (error) {
    console.error("Error fetching maintenance services:", error);
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

    const { serviceType, date, time, notes } = await request.json();

    if (!serviceType || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create booking record
    const { data, error } = await supabase
      .from("maintenance_bookings")
      .insert({
        user_id: user.id,
        service_type: serviceType,
        booking_date: date,
        booking_time: time,
        notes: notes || "",
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ booking: data[0], success: true });
  } catch (error) {
    console.error("Error booking maintenance service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
