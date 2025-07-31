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
    let width = undefined;
    let height = undefined;
    const buf = new Uint8Array(imageBuffer);
    // PNG
    if (
      contentType.includes("png") &&
      buf.length > 24 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50
    ) {
      width = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
      height = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    }
    // JPEG (busca SOF0/SOF2 en todo el buffer)
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      let i = 0;
      while (i < buf.length - 9) {
        if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2)) {
          height = (buf[i + 5] << 8) + buf[i + 6];
          width = (buf[i + 7] << 8) + buf[i + 8];
          break;
        }
        i++;
      }
    }
    // WebP
    else if (contentType.includes("webp") && buf.length > 30) {
      // WebP: width/height están en los bytes 26-29 (little endian)
      width = buf[26] + (buf[27] << 8);
      height = buf[28] + (buf[29] << 8);
    }
    // Si no se puede extraer, usar dimensiones fijas
    if (!width || !height) {
      width = 800;
      height = 600;
    }
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    };
    if (width && height) {
      headers["X-Image-Width"] = width.toString();
      headers["X-Image-Height"] = height.toString();
    }
    return new Response(imageBuffer, {
      status: 200,
      headers,
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
