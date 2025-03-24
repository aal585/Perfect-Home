import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  query: string;
  language: string;
  searchType?: string;
  userId?: string;
}

interface ProcessedQuery {
  location: string;
  propertyType: string;
  features: string[];
  priceRange?: string;
}

async function processNaturalLanguageQuery(
  query: string,
  language: string,
): Promise<ProcessedQuery> {
  // This is a simplified implementation
  // In a real app, you would use a more sophisticated NLP service
  const lowerQuery = query.toLowerCase();

  // Extract location (simplified example)
  let location = "";
  if (lowerQuery.includes("new cairo") || lowerQuery.includes("التجمع")) {
    location = "New Cairo";
  } else if (lowerQuery.includes("maadi") || lowerQuery.includes("المعادي")) {
    location = "Maadi";
  } else if (lowerQuery.includes("zayed") || lowerQuery.includes("زايد")) {
    location = "Sheikh Zayed";
  }

  // Extract property type (simplified example)
  let propertyType = "";
  if (lowerQuery.includes("apartment") || lowerQuery.includes("شقة")) {
    propertyType = "Apartment";
  } else if (lowerQuery.includes("villa") || lowerQuery.includes("فيلا")) {
    propertyType = "Villa";
  } else if (
    lowerQuery.includes("townhouse") ||
    lowerQuery.includes("تاون هاوس")
  ) {
    propertyType = "Townhouse";
  }

  // Extract features (simplified example)
  const features: string[] = [];
  if (lowerQuery.includes("garden") || lowerQuery.includes("حديقة")) {
    features.push("garden");
  }
  if (lowerQuery.includes("pool") || lowerQuery.includes("مسبح")) {
    features.push("pool");
  }
  if (lowerQuery.includes("furnished") || lowerQuery.includes("مفروشة")) {
    features.push("furnished");
  }

  return {
    location,
    propertyType,
    features,
  };
}

async function storeSearchHistory(supabase: any, searchData: any) {
  const { data, error } = await supabase.from("search_history").insert([
    {
      user_id: searchData.userId,
      query: searchData.query,
      search_type: searchData.searchType,
      location: searchData.location,
      property_type: searchData.propertyType,
      features: searchData.features,
      language: searchData.language || "en",
    },
  ]);

  if (error) {
    console.error("Error storing search history:", error);
  }

  return data;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      query,
      language,
      searchType = "properties",
      userId,
    } = (await req.json()) as SearchRequest;

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Process the natural language query
    const processedQuery = await processNaturalLanguageQuery(query, language);

    // Store search in history if user is logged in
    if (userId) {
      await storeSearchHistory(supabaseClient, {
        userId,
        query,
        searchType,
        location: processedQuery.location,
        propertyType: processedQuery.propertyType,
        features: processedQuery.features,
        language,
      });
    }

    // Perform the search based on processed query
    let searchResults;
    if (searchType === "properties") {
      const { data, error } = await supabaseClient
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      searchResults = data;

      // Filter results based on processed query (simplified)
      if (processedQuery.location) {
        searchResults = searchResults.filter((p: any) =>
          p.location
            ?.toLowerCase()
            .includes(processedQuery.location.toLowerCase()),
        );
      }

      if (processedQuery.propertyType) {
        searchResults = searchResults.filter(
          (p: any) =>
            p.property_type?.toLowerCase() ===
            processedQuery.propertyType.toLowerCase(),
        );
      }

      if (processedQuery.features.length > 0) {
        searchResults = searchResults.filter((p: any) => {
          if (!p.features) return false;
          return processedQuery.features.some((f) => p.features.includes(f));
        });
      }
    } else if (searchType === "furniture") {
      // Similar implementation for furniture search
      const { data, error } = await supabaseClient
        .from("furniture")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      searchResults = data;
    } else if (searchType === "maintenance") {
      // Similar implementation for maintenance search
      const { data, error } = await supabaseClient
        .from("maintenance")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      searchResults = data;
    }

    return new Response(
      JSON.stringify({
        results: searchResults || [],
        processedQuery,
        searchType,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
