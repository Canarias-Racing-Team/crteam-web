import type { APIRoute } from "astro";

import { getNewsImagesFromNotion } from "@utils/notion";
import { redis } from "@utils/redis";

function getEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = import.meta.env[key] || process.env[key];
    if (value) return value;
  }
  return undefined;
}

export const GET: APIRoute = async ({ request }) => {
  const apiKey = request.headers.get("x-api-key");
  const VALID_KEY = getEnv(["API_NEWS_IMAGES_KEY"]);
  if (apiKey !== VALID_KEY) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    // Intenta obtener de Redis primero
    const cacheKey = "news-images";
    const cached = await redis.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify({ images: cached }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    // Si no hay caché, consulta Notion
    const images = await getNewsImagesFromNotion();
    // Guarda en Redis por 1 hora (3600s)
    await redis.set(cacheKey, images, { ex: 3600 });
    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
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
