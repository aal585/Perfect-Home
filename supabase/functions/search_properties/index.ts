import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SearchParams {
  query?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  language?: "en" | "ar";
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get search parameters from request
    const {
      query,
      location,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      language = "en",
    } = (await req.json()) as SearchParams;

    // Build the query
    let propertiesQuery = supabase
      .from("properties")
      .select("*, property_images(*), property_features(*)")
      .eq("status", "available");

    // Apply filters
    if (location) {
      propertiesQuery = propertiesQuery.ilike("location", `%${location}%`);
    }

    if (propertyType) {
      propertiesQuery = propertiesQuery.eq("property_type", propertyType);
    }

    if (minPrice) {
      propertiesQuery = propertiesQuery.gte("price", minPrice);
    }

    if (maxPrice) {
      propertiesQuery = propertiesQuery.lte("price", maxPrice);
    }

    if (bedrooms) {
      propertiesQuery = propertiesQuery.gte("bedrooms", bedrooms);
    }

    // If there's a natural language query, we would use a more sophisticated search
    // In a real implementation, this would use a vector search or AI processing
    if (query) {
      // Simple implementation - search in title and description
      propertiesQuery = propertiesQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`,
      );
    }

    const { data: properties, error } = await propertiesQuery;

    if (error) throw error;

    return new Response(JSON.stringify({ properties }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
