import type { APIRoute } from "astro";
import { getNewsImagesFromNotion } from "@utils/notion";

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
    const images = await getNewsImagesFromNotion();
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
