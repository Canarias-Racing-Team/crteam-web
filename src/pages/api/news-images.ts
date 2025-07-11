import type { APIRoute } from "astro";
import { getNewsImagesFromNotion } from "@utils/notion";
import fs from "fs/promises";
import path from "path";

const CACHE_DURATION = import.meta.env.API_NEWS_IMAGES_CACHE_TTL;
const CACHE_FILE = path.resolve(process.cwd(), "public/news-images/cache.json");

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

    // Leer el archivo de caché si existe
    try {
      const cacheRaw = await fs.readFile(CACHE_FILE, "utf-8");
      const cacheData = JSON.parse(cacheRaw);
      cachedImages = cacheData.images || [];
      lastCacheTime = cacheData.lastCacheTime || 0;
    } catch (err) {
      // Si no existe el archivo, se ignora
    }

    if (
      forceRefresh ||
      !cachedImages.length ||
      now - lastCacheTime > CACHE_DURATION
    ) {
      cachedImages = await getNewsImagesFromNotion();
      lastCacheTime = now;
      // Guardar en el archivo de caché
      await fs.writeFile(
        CACHE_FILE,
        JSON.stringify({ images: cachedImages, lastCacheTime }),
        "utf-8"
      );
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
