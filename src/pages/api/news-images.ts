import type { APIRoute } from "astro";
import { getNewsImagesFromNotion } from "@utils/notion";

// Caché en memoria para las URLs de imágenes
let cachedImages: string[] = [];
let lastCacheTime = 0;
const CACHE_DURATION = import.meta.env.API_NEWS_IMAGES_CACHE_TTL;

export const GET: APIRoute = async ({ request }) => {
  const apiKey = request.headers.get("x-api-key");
  const VALID_KEY = import.meta.env.API_NEWS_IMAGES_KEY;

  if (apiKey !== VALID_KEY) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const now = Date.now();
    if (
      forceRefresh ||
      !cachedImages.length ||
      now - lastCacheTime > CACHE_DURATION
    ) {
      cachedImages = await getNewsImagesFromNotion();
      lastCacheTime = now;
    }
    return new Response(JSON.stringify({ images: cachedImages }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "No se pudieron obtener las imágenes." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
