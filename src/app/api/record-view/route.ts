import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 },
      );
    }

    // Record the property view in browsing history
    const { error } = await supabase.from("browsing_history").upsert(
      {
        user_id: user.id,
        property_id: propertyId,
        viewed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,property_id",
        ignoreDuplicates: false,
      },
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording property view:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
