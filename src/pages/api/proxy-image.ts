import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ error: "Falta parámetro 'url'" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "No se pudo obtener la imagen" }),
        {
          status: res.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno al obtener la imagen" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};
