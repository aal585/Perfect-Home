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

    const { furnitureId } = await request.json();

    if (!furnitureId) {
      return NextResponse.json(
        { error: "Furniture ID is required" },
        { status: 400 },
      );
    }

    // Record the furniture view in browsing history
    const { error } = await supabase.from("furniture_browsing_history").upsert(
      {
        user_id: user.id,
        furniture_id: furnitureId,
        viewed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,furniture_id",
        ignoreDuplicates: false,
      },
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording furniture view:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
