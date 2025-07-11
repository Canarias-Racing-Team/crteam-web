import type { APIRoute } from "astro";
import { getNewsImagesFromNotion } from "@utils/notion";
import { Redis } from "@upstash/redis";

const CACHE_DURATION = import.meta.env.API_NEWS_IMAGES_CACHE_TTL;
const redis = new Redis({
  url: process.env.KV_REST_URL!,
  token: process.env.KV_REST_TOKEN!,
});
const CACHE_KEY = "news_images_cache";

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
    let cachedImages: string[] = [];
    let lastCacheTime = 0;

    // Leer el caché desde Redis
    const cacheData = (await redis.get(CACHE_KEY)) as {
      images?: string[];
      lastCacheTime?: number;
    } | null;
    if (cacheData) {
      cachedImages = Array.isArray(cacheData.images) ? cacheData.images : [];
      lastCacheTime =
        typeof cacheData.lastCacheTime === "number"
          ? cacheData.lastCacheTime
          : 0;
    }

    if (
      forceRefresh ||
      !cachedImages.length ||
      now - lastCacheTime > CACHE_DURATION
    ) {
      cachedImages = await getNewsImagesFromNotion();
      lastCacheTime = now;
      // Guardar en Redis
      await redis.set(CACHE_KEY, { images: cachedImages, lastCacheTime });
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
