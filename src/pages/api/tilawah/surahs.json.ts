/**
 * API endpoint to fetch all surahs from equran.id
 * Proxies the request server-side to avoid CORS issues
 */

export async function GET() {
  try {
    const response = await fetch("https://equran.id/api/v2/surat");
    if (!response.ok) {
      throw new Error("Failed to fetch surahs from equran.id");
    }
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
