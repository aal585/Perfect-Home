// recommend-furniture edge function

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { user_id, property_id, limit = 6 } = await req.json();

    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Get Supabase client with admin privileges
    const supabaseAdmin =
      Deno.env.get("SUPABASE_URL") && Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
        ? await createClient(
            Deno.env.get("SUPABASE_URL") || "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
            {
              global: {
                headers: { Authorization: req.headers.get("Authorization")! },
              },
            },
          )
        : null;

    if (!supabaseAdmin) {
      throw new Error("Supabase admin client could not be initialized");
    }

    let recommendedFurniture = [];

    // If property_id is provided, recommend furniture based on property characteristics
    if (property_id) {
      // Get property details
      const { data: property, error: propertyError } = await supabaseAdmin
        .from("properties")
        .select("*")
        .eq("id", property_id)
        .single();

      if (propertyError) {
        throw propertyError;
      }

      // Recommend furniture based on property type and size
      let query = supabaseAdmin.from("furniture").select("*");

      // Filter by appropriate categories based on property type
      if (
        property.property_type === "Apartment" ||
        property.property_type === "Penthouse"
      ) {
        query = query.in("category", ["Living Room", "Bedroom", "Dining Room"]);
      } else if (
        property.property_type === "Villa" ||
        property.property_type === "Townhouse"
      ) {
        query = query.in("category", [
          "Living Room",
          "Bedroom",
          "Dining Room",
          "Outdoor",
        ]);
      } else if (property.property_type === "Chalet") {
        query = query.in("category", ["Living Room", "Bedroom", "Outdoor"]);
      }

      // Get furniture recommendations
      const { data: furnitureByProperty, error: furnitureError } =
        await query.limit(limit);

      if (furnitureError) {
        throw furnitureError;
      }

      recommendedFurniture = furnitureByProperty || [];
    } else {
      // Get user's browsing history for furniture
      const { data: furnitureBrowsingHistory, error: historyError } =
        await supabaseAdmin
          .from("furniture_browsing_history")
          .select("furniture_id, viewed_at")
          .eq("user_id", user_id)
          .order("viewed_at", { ascending: false })
          .limit(10);

      if (historyError && historyError.code !== "PGRST116") {
        throw historyError;
      }

      // Get categories of recently viewed furniture
      const recentFurnitureIds =
        furnitureBrowsingHistory?.map((item) => item.furniture_id) || [];

      if (recentFurnitureIds.length > 0) {
        // Get details of recently viewed furniture
        const { data: recentFurniture, error: recentError } =
          await supabaseAdmin
            .from("furniture")
            .select("category")
            .in("id", recentFurnitureIds);

        if (recentError) {
          throw recentError;
        }

        // Extract categories from recently viewed furniture
        const recentCategories = [
          ...new Set(recentFurniture?.map((f) => f.category) || []),
        ];

        // Get similar furniture based on categories
        if (recentCategories.length > 0) {
          const { data: similarFurniture, error: similarError } =
            await supabaseAdmin
              .from("furniture")
              .select("*")
              .in("category", recentCategories)
              .not("id", "in", recentFurnitureIds)
              .limit(limit);

          if (similarError) {
            throw similarError;
          }

          recommendedFurniture = similarFurniture || [];
        }
      }

      // If we don't have enough recommendations, get popular furniture
      if (recommendedFurniture.length < limit) {
        const { data: popularFurniture, error: popularError } =
          await supabaseAdmin
            .from("furniture")
            .select("*")
            .order("price_numeric", { ascending: false }) // Assuming higher priced furniture is more popular
            .limit(limit - recommendedFurniture.length);

        if (popularError) {
          throw popularError;
        }

        // Add popular furniture to recommendations
        recommendedFurniture.push(...(popularFurniture || []));
      }
    }

    return new Response(
      JSON.stringify({ recommendations: recommendedFurniture }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});

// Helper function to create Supabase client
async function createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options?: any,
) {
  const { createClient } = await import(
    "https://esm.sh/@supabase/supabase-js@2"
  );
  return createClient(supabaseUrl, supabaseKey, options);
}
