import type { APIRoute } from "astro";

// Caché en memoria para dimensiones por URL
const imageDimensionCache: Record<
  string,
  { width: number; height: number; contentType: string }
> = {};

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
    // Si la petición es HEAD, solo obtener los headers necesarios para dimensiones
    if (request.method === "HEAD") {
      // Si está en caché, responde instantáneamente
      if (imageDimensionCache[url]) {
        const { width, height, contentType } = imageDimensionCache[url];
        const headers: Record<string, string> = {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600",
          "X-Image-Width": width.toString(),
          "X-Image-Height": height.toString(),
        };
        return new Response(null, {
          status: 200,
          headers,
        });
      }
      // Descargar solo los primeros bytes necesarios para extraer dimensiones
      const res = await fetch(url, { headers: { Range: "bytes=0-1023" } });
      if (!res.ok) {
        return new Response(null, {
          status: res.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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
        width = buf[26] + (buf[27] << 8);
        height = buf[28] + (buf[29] << 8);
      }
      if (!width || !height) {
        width = 800;
        height = 600;
      }
      // Guardar en caché
      imageDimensionCache[url] = { width, height, contentType };
      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        "X-Image-Width": width.toString(),
        "X-Image-Height": height.toString(),
      };
      return new Response(null, {
        status: 200,
        headers,
      });
    }

    // Para GET, descargar la imagen completa como antes
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
      width = buf[26] + (buf[27] << 8);
      height = buf[28] + (buf[29] << 8);
    }
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
      // Guardar en caché también al servir la imagen completa
      imageDimensionCache[url] = { width, height, contentType };
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
