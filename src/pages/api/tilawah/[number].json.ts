/**
 * API endpoint to fetch a specific surah with all its ayahs
 * URL: /api/tilawah/[number].json
 * Proxies the request server-side to avoid CORS issues
 */

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const { number } = params;

  if (!number || isNaN(Number(number))) {
    return new Response(JSON.stringify({ error: "Invalid surah number" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${number}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${number} from equran.id`);
    }
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=604800", // Cache for 7 days
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
