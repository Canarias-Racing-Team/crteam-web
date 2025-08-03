import type { APIRoute } from "astro";
import { redis } from "@utils/redis";
import crypto from "crypto";

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

  // Función para responder error real si hay error
  const respondEmpty = (error = "unknown_error", status = 410) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "X-Proxy-Error": error,
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
            "Cache-Control": "public, max-age=2592000",
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
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        console.log(`[proxy-image] HEAD fetch url: ${url}`);
        console.log(`[proxy-image] HEAD fetch status: ${res.status}`);
        console.log(
          `[proxy-image] HEAD fetch headers:`,
          Object.fromEntries(res.headers.entries())
        );
      } catch (e) {
        console.error(`[proxy-image] HEAD fetch error:`, e);
        return respondEmpty("fetch_error", 502);
      }
      if (res.status === 403) {
        console.warn(`[proxy-image] HEAD fetch 403 para url: ${url}`);
        return respondEmpty("status_403", 403);
      }
      if (!res.ok) {
        console.warn(
          `[proxy-image] HEAD fetch not ok (${res.status}) para url: ${url}`
        );
        return respondEmpty("status_not_ok", res.status);
      }
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
      if (!width || !height || width < 2 || height < 2) {
        // No se pudo obtener dimensiones válidas
        console.warn(`[proxy-image] Dimensiones inválidas para HEAD: ${url}`);
        return respondEmpty("invalid_image_dimensions", 422);
      }
      // Solo cachea si es válido
      if (res.status === 200) {
        imageDimensionCache[url] = { width, height, contentType };
      }
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=2592000",
          "X-Image-Width": width.toString(),
          "X-Image-Height": height.toString(),
        },
      });
    }

    // GET: imagen completa (con caché Redis)
    // Clave hash para Redis
    const hash = crypto.createHash("sha256").update(url).digest("hex");
    const redisKey = `proxy-image:${hash}`;
    const cached = (await redis.get(redisKey)) as {
      data: string;
      headers: Record<string, string>;
    } | null;
    if (cached && cached.data && cached.headers) {
      // Decodifica el buffer base64
      const imageBuffer = Buffer.from(cached.data, "base64");
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          ...cached.headers,
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    // Si no hay caché, descarga de Notion
    let res;
    try {
      res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      console.log(`[proxy-image] GET fetch url: ${url}`);
      console.log(`[proxy-image] GET fetch status: ${res.status}`);
      console.log(
        `[proxy-image] GET fetch headers:`,
        Object.fromEntries(res.headers.entries())
      );
    } catch (e) {
      console.error(`[proxy-image] GET fetch error:`, e);
      return respondEmpty("fetch_error", 502);
    }
    if (res.status === 403) {
      console.warn(`[proxy-image] GET fetch 403 para url: ${url}`);
      return respondEmpty("status_403", 403);
    }
    if (!res.ok) {
      console.warn(
        `[proxy-image] GET fetch not ok (${res.status}) para url: ${url}`
      );
      return respondEmpty("status_not_ok", res.status);
    }
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
    // Relajar chequeo: servir cualquier imagen válida por content-type
    let headersToCache: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2592000",
    };
    if (width && height && width > 1 && height > 1) {
      imageDimensionCache[url] = { width, height, contentType };
      headersToCache["X-Image-Width"] = width.toString();
      headersToCache["X-Image-Height"] = height.toString();
    }
    await redis.set(
      redisKey,
      {
        data: Buffer.from(imageBuffer).toString("base64"),
        headers: headersToCache,
      },
      { ex: 86400 }
    );
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        ...headersToCache,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return respondEmpty("unknown_error", 500);
  }
};
