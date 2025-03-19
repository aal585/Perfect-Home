import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RecommendationParams {
  propertyType?: string;
  roomType?: string;
  style?: string;
  budget?: number;
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

    // Get recommendation parameters from request
    const {
      propertyType,
      roomType,
      style,
      budget,
      language = "en",
    } = (await req.json()) as RecommendationParams;

    // Build the query
    let furnitureQuery = supabase
      .from("furniture_items")
      .select("*, furniture_categories(name)");

    // Apply filters
    if (roomType) {
      furnitureQuery = furnitureQuery.eq("furniture_categories.name", roomType);
    }

    if (budget) {
      furnitureQuery = furnitureQuery.lte("price", budget);
    }

    // In a real implementation, we would use more sophisticated matching for style
    // and property type compatibility

    const { data: recommendations, error } = await furnitureQuery;

    if (error) throw error;

    return new Response(JSON.stringify({ recommendations }), {
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
