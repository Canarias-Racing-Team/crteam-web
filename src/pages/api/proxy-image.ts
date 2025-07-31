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

  // Placeholder PNG 1x1 transparente
  const PNG_PLACEHOLDER = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBApU3nAAAAABJRU5ErkJggg==",
    "base64"
  );
  // Función para responder placeholder
  const respondPlaceholder = (width = 1, height = 1) =>
    new Response(PNG_PLACEHOLDER, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        "X-Image-Width": width.toString(),
        "X-Image-Height": height.toString(),
      },
    });

  try {
    // HEAD: solo dimensiones
    if (request.method === "HEAD") {
      if (imageDimensionCache[url]) {
        const { width, height, contentType } = imageDimensionCache[url];
        return new Response(null, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600",
            "X-Image-Width": width.toString(),
            "X-Image-Height": height.toString(),
          },
        });
      }
      let res;
      try {
        res = await fetch(url, {
          headers: {
            Range: "bytes=0-1023",
            Referer: "https://crteam.es/",
            "User-Agent": "Mozilla/5.0 (compatible; CRTeamBot/1.0)",
          },
        });
      } catch {
        return respondPlaceholder(800, 600);
      }
      if (res.status === 403) return respondPlaceholder(800, 600);
      if (!res.ok) return respondPlaceholder(800, 600);
      const contentType =
        res.headers.get("content-type") || "application/octet-stream";
      const imageBuffer = await res.arrayBuffer();
      let width, height;
      const buf = new Uint8Array(imageBuffer);
      if (
        contentType.includes("png") &&
        buf.length > 24 &&
        buf[0] === 0x89 &&
        buf[1] === 0x50
      ) {
        width = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
        height = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
      } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        let i = 0;
        while (i < buf.length - 9) {
          if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2)) {
            height = (buf[i + 5] << 8) + buf[i + 6];
            width = (buf[i + 7] << 8) + buf[i + 8];
            break;
          }
          i++;
        }
      } else if (contentType.includes("webp") && buf.length > 30) {
        width = buf[26] + (buf[27] << 8);
        height = buf[28] + (buf[29] << 8);
      }
      if (!width || !height) {
        width = 800;
        height = 600;
      }
      // Solo cachea si no es placeholder
      if (res.status === 200 && width > 1 && height > 1) {
        imageDimensionCache[url] = { width, height, contentType };
      }
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600",
          "X-Image-Width": width.toString(),
          "X-Image-Height": height.toString(),
        },
      });
    }

    // GET: imagen completa
    let res;
    try {
      res = await fetch(url, {
        headers: {
          Referer: "https://crteam.es/",
          "User-Agent": "Mozilla/5.0 (compatible; CRTeamBot/1.0)",
        },
      });
    } catch {
      return respondPlaceholder();
    }
    if (res.status === 403) return respondPlaceholder();
    if (!res.ok) return respondPlaceholder();
    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const imageBuffer = await res.arrayBuffer();
    let width, height;
    const buf = new Uint8Array(imageBuffer);
    if (
      contentType.includes("png") &&
      buf.length > 24 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50
    ) {
      width = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
      height = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      let i = 0;
      while (i < buf.length - 9) {
        if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2)) {
          height = (buf[i + 5] << 8) + buf[i + 6];
          width = (buf[i + 7] << 8) + buf[i + 8];
          break;
        }
        i++;
      }
    } else if (contentType.includes("webp") && buf.length > 30) {
      width = buf[26] + (buf[27] << 8);
      height = buf[28] + (buf[29] << 8);
    }
    if (width && height && width > 1 && height > 1) {
      imageDimensionCache[url] = { width, height, contentType };
    }
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        ...(width && height
          ? {
              "X-Image-Width": width.toString(),
              "X-Image-Height": height.toString(),
            }
          : {}),
      },
    });
  } catch {
    return respondPlaceholder();
  }
};
