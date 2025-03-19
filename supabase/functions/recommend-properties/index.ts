// recommend-properties edge function

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
    const { user_id, limit = 6 } = await req.json();

    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Get Supabase client with admin privileges
    const supabaseAdmin = await createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabaseAdmin
      .from("user_preferences")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (preferencesError && preferencesError.code !== "PGRST116") {
      throw preferencesError;
    }

    // Get user browsing history
    const { data: browsingHistory, error: historyError } = await supabaseAdmin
      .from("browsing_history")
      .select("property_id, viewed_at")
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false })
      .limit(10);

    if (historyError) {
      throw historyError;
    }

    // Get user saved properties
    const { data: savedProperties, error: savedError } = await supabaseAdmin
      .from("saved_properties")
      .select("property_id")
      .eq("user_id", user_id);

    if (savedError) {
      throw savedError;
    }

    // Build query based on user preferences and history
    let query = supabaseAdmin.from("properties").select("*");

    // Apply preference filters if available
    if (preferences) {
      if (preferences.min_price) {
        query = query.gte("price_numeric", preferences.min_price);
      }
      if (preferences.max_price) {
        query = query.lte("price_numeric", preferences.max_price);
      }
      if (preferences.min_beds) {
        query = query.gte("beds", preferences.min_beds);
      }
      if (preferences.min_baths) {
        query = query.gte("baths", preferences.min_baths);
      }
      if (
        preferences.preferred_locations &&
        preferences.preferred_locations.length > 0
      ) {
        query = query.in("location", preferences.preferred_locations);
      }
      if (
        preferences.preferred_property_types &&
        preferences.preferred_property_types.length > 0
      ) {
        query = query.in("property_type", preferences.preferred_property_types);
      }
    }

    // Exclude properties the user has already saved
    const savedPropertyIds =
      savedProperties?.map((item) => item.property_id) || [];
    if (savedPropertyIds.length > 0) {
      query = query.not("id", "in", savedPropertyIds);
    }

    // Get recently viewed property types and locations for better recommendations
    const recentlyViewedPropertyIds =
      browsingHistory?.map((item) => item.property_id) || [];

    // Get properties based on preferences
    const { data: recommendedProperties, error: recommendedError } =
      await query.limit(limit);

    if (recommendedError) {
      throw recommendedError;
    }

    // If we don't have enough recommendations based on preferences, get similar properties to recently viewed
    if (
      recommendedProperties.length < limit &&
      recentlyViewedPropertyIds.length > 0
    ) {
      // Get details of recently viewed properties
      const { data: recentProperties, error: recentError } = await supabaseAdmin
        .from("properties")
        .select("location, property_type")
        .in("id", recentlyViewedPropertyIds)
        .limit(5);

      if (recentError) {
        throw recentError;
      }

      // Extract locations and property types from recently viewed properties
      const recentLocations = [
        ...new Set(recentProperties?.map((p) => p.location) || []),
      ];
      const recentPropertyTypes = [
        ...new Set(recentProperties?.map((p) => p.property_type) || []),
      ];

      // Get similar properties based on location and property type
      if (recentLocations.length > 0 || recentPropertyTypes.length > 0) {
        let similarQuery = supabaseAdmin.from("properties").select("*");

        // Exclude already recommended properties
        const existingIds = recommendedProperties.map((p) => p.id);
        if (existingIds.length > 0) {
          similarQuery = similarQuery.not("id", "in", existingIds);
        }

        // Exclude saved properties
        if (savedPropertyIds.length > 0) {
          similarQuery = similarQuery.not("id", "in", savedPropertyIds);
        }

        // Apply filters based on recent activity
        if (recentLocations.length > 0) {
          similarQuery = similarQuery.in("location", recentLocations);
        }
        if (recentPropertyTypes.length > 0) {
          similarQuery = similarQuery.in("property_type", recentPropertyTypes);
        }

        const { data: similarProperties, error: similarError } =
          await similarQuery.limit(limit - recommendedProperties.length);

        if (similarError) {
          throw similarError;
        }

        // Combine recommendations
        recommendedProperties.push(...(similarProperties || []));
      }
    }

    // If we still don't have enough recommendations, get popular properties
    if (recommendedProperties.length < limit) {
      let popularQuery = supabaseAdmin.from("properties").select("*");

      // Exclude already recommended properties
      const existingIds = recommendedProperties.map((p) => p.id);
      if (existingIds.length > 0) {
        popularQuery = popularQuery.not("id", "in", existingIds);
      }

      // Exclude saved properties
      if (savedPropertyIds.length > 0) {
        popularQuery = popularQuery.not("id", "in", savedPropertyIds);
      }

      const { data: popularProperties, error: popularError } =
        await popularQuery
          .order("price_numeric", { ascending: false }) // Assuming higher priced properties are more popular
          .limit(limit - recommendedProperties.length);

      if (popularError) {
        throw popularError;
      }

      // Add popular properties to recommendations
      recommendedProperties.push(...(popularProperties || []));
    }

    return new Response(
      JSON.stringify({ recommendations: recommendedProperties }),
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
