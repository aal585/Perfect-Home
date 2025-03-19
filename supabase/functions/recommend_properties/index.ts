import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  property_type: string;
  features: string[];
}

interface UserPreference {
  user_id: string;
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  min_baths?: number;
  preferred_locations?: string[];
  preferred_property_types?: string[];
}

interface BrowsingHistory {
  user_id: string;
  property_id: string;
  viewed_at: string;
}

interface SavedProperty {
  user_id: string;
  property_id: string;
  saved_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request data
    const { user_id, limit = 6 } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get user preferences
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user_id)
      .single();

    // Get user browsing history
    const { data: browsingHistory } = await supabase
      .from("browsing_history")
      .select("property_id, viewed_at")
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false })
      .limit(10);

    // Get user saved properties
    const { data: savedProperties } = await supabase
      .from("saved_properties")
      .select("property_id")
      .eq("user_id", user_id);

    // Extract property IDs from history and saved properties
    const historyPropertyIds =
      browsingHistory?.map((item) => item.property_id) || [];
    const savedPropertyIds =
      savedProperties?.map((item) => item.property_id) || [];

    // Build recommendation query based on user data
    let query = supabase.from("properties").select("*");

    // Apply filters based on user preferences if available
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

    // Get properties that match user preferences
    const { data: recommendedProperties, error } = await query.limit(limit * 2); // Fetch more than needed to allow for filtering

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Score and rank properties
    const scoredProperties = recommendedProperties.map((property: Property) => {
      let score = 0;

      // Higher score for properties similar to those in browsing history
      if (historyPropertyIds.includes(property.id)) {
        score += 5;
      }

      // Higher score for properties with similar location to browsing history
      const historyLocations =
        browsingHistory
          ?.map((item) => {
            const historyProperty = recommendedProperties.find(
              (p) => p.id === item.property_id,
            );
            return historyProperty?.location;
          })
          .filter(Boolean) || [];

      if (historyLocations.includes(property.location)) {
        score += 3;
      }

      // Higher score for properties with similar property type to browsing history
      const historyPropertyTypes =
        browsingHistory
          ?.map((item) => {
            const historyProperty = recommendedProperties.find(
              (p) => p.id === item.property_id,
            );
            return historyProperty?.property_type;
          })
          .filter(Boolean) || [];

      if (historyPropertyTypes.includes(property.property_type)) {
        score += 2;
      }

      // Exclude properties that are already saved
      if (savedPropertyIds.includes(property.id)) {
        score = -1; // Mark to be filtered out
      }

      return { property, score };
    });

    // Filter out saved properties and sort by score
    const filteredAndSorted = scoredProperties
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.property)
      .slice(0, limit);

    return new Response(
      JSON.stringify({ recommendations: filteredAndSorted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
