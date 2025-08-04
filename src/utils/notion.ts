import { Client } from "@notionhq/client";
import type { NotionPageType } from "@types";
import { config } from "dotenv";

// Cargar las variables de entorno desde el archivo .env
config();

let NOTION_API_KEY: string | undefined = process.env.NOTION_API_KEY;
let NOTION_DATABASE_ID: string | undefined = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  throw new Error(
    "Faltan las variables de entorno NOTION_API_KEY o NOTION_DATABASE_ID"
  );
}

const notion = new Client({ auth: NOTION_API_KEY });
const databaseId: string = NOTION_DATABASE_ID;

// Permite activar DEBUG por variable de entorno
const DEBUG =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.DEBUG === "true") ||
  false;

if (DEBUG) {
  getNotionDatabaseStructure(); // El log ya está dentro de la función
}

// Utilidad para convertir un string a slug (fuera de la función para evitar redefinir)
function slugify(text: string): string {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Utilidades para extraer propiedades de Notion de forma segura
function getTitle(props: any, key: string): string {
  return props[key]?.type === "title"
    ? props[key].title?.[0]?.plain_text ?? ""
    : "";
}
function getCheckbox(props: any, key: string): boolean {
  return props[key]?.type === "checkbox" ? props[key].checkbox ?? false : false;
}
function getRichText(props: any, key: string): string {
  if (props[key]?.type === "rich_text" && Array.isArray(props[key].rich_text)) {
    return props[key].rich_text.map((t: any) => t.plain_text).join("");
  }
  return "";
}
function getCreatedTime(props: any, key: string, fallback: string): string {
  // Devuelve la fecha de tipo 'date' si existe, si no, el fallback
  if (props[key]?.type === "date" && props[key].date?.start) {
    return props[key].date.start;
  }
  return fallback;
}
function getImageUrl(props: any, key: string): string {
  if (
    props[key]?.type === "files" &&
    Array.isArray(props[key].files) &&
    props[key].files[0]
  ) {
    const file = props[key].files[0];
    if (file.type === "file") return file.file.url;
    if (file.type === "external") return file.external.url;
  }
  return "";
}
function getAuthor(props: any, key: string): string {
  return props[key]?.type === "people" &&
    Array.isArray(props[key].people) &&
    props[key].people[0]
    ? (props[key].people[0] as any).name || ""
    : "";
}

export async function getNotionPages(): Promise<NotionPageType[]> {
  const response = await notion.databases.query({ database_id: databaseId });
  const filteredResults = response.results
    .filter(
      (
        page
      ): page is import("@notionhq/client/build/src/api-endpoints").PageObjectResponse =>
        "properties" in page
    )
    .map((page) => {
      const props = page.properties;
      const nombre = getTitle(props, "Nombre");
      return {
        Publicado: getCheckbox(props, "Publicado"),
        Contenido: getRichText(props, "Contenido"),
        Fecha: getCreatedTime(props, "Fecha de Publicación", page.created_time),
        Imagen: getImageUrl(props, "Imagen"),
        url: slugify(nombre),
        Nombre: nombre,
        Autor: getAuthor(props, "Autor"),
      };
    })
    .filter((page) => page.Publicado === true)
    .sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime());

  if (DEBUG) {
    console.log(`📰 Notion: ${filteredResults.length} páginas procesadas`);
    const debugData = filteredResults.map((page) => ({
      ...page,
      Contenido: `${page.Contenido.length} caracteres`,
      Imagen: page.Imagen ? "URL de imagen" : "Sin imagen",
      url: page.url || "Sin URL",
      Nombre: page.Nombre || "Sin nombre",
      Autor: page.Autor || "Sin autor",
      Fecha: new Date(page.Fecha).toLocaleDateString(),
      Publicado: page.Publicado ? "Sí" : "No",
    }));
    console.log("🔧 JSON filtrado:", JSON.stringify(debugData, null, 2));
  }
  return filteredResults;
}

// Función para obtener la estructura de la base de datos
export async function getNotionDatabaseStructure() {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });

  // Debug simple
  if (DEBUG) {
    console.log(
      "🔧 Notion BD (keys):",
      Object.keys(response.properties).join(", ")
    );
    console.log(
      "🔧 Notion BD (raw):",
      JSON.stringify(response.properties, null, 2)
    );
  }

  return response.properties;
}

// Devuelve un array de URLs de imágenes de las news desde Notion
export async function getNewsImagesFromNotion(): Promise<string[]> {
  // Obtiene las páginas publicadas y extrae las URLs de imagen
  const pages = await getNotionPages();
  // Filtra y devuelve solo las URLs válidas
  return pages
    .map((page) => page.Imagen)
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import { fileURLToPath } from "url";

// Definir __filename y __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Descarga una imagen desde una URL y la guarda en la ruta especificada.
 * @param url - URL de la imagen a descargar.
 * @param dest - Ruta de destino donde se guardará la imagen.
 * @returns Una promesa que se resuelve cuando la descarga finaliza.
 */
function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(
          new Error(`Error al descargar ${url}: Código ${res.statusCode}`)
        );
        res.resume(); // Consume datos para liberar recursos
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
      fileStream.on("error", (err) => {
        // Eliminar archivo incompleto si hay error
        fileStream.close();
        fs.unlink(dest, () => reject(err));
      });
    });
    req.on("error", (err) => {
      // Eliminar archivo incompleto si hay error
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

/**
 * Descarga todas las imágenes de Notion y las guarda en una carpeta local.
 * @returns Una promesa que se resuelve cuando todas las imágenes han sido descargadas.
 */
export async function downloadNewsImagesToLocal(): Promise<void> {
  try {
    const pages = await getNotionPages();
    const images = pages
      .map((page) => ({ url: page.Imagen, slug: page.url }))
      .filter((item): item is { url: string; slug: string } => !!item.url);

    if (images.length === 0) {
      console.error("No se encontraron imágenes para descargar.");
      return;
    }

    const destDir: string = path.resolve(
      __dirname,
      "../../public/news-images"
    );
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const CONCURRENCY = 5;
    let index = 0;
    let downloadedCount = 0;

    const downloadNext = async (): Promise<void> => {
      if (index >= images.length) return;
      const { url, slug } = images[index++];
      const extension = path.extname(new URL(url).pathname);
      const fileName = `${slug}${extension}`;
      const destPath = path.join(destDir, fileName);

      if (fs.existsSync(destPath)) {
        return downloadNext();
      }

      try {
        await downloadImage(url, destPath);
        downloadedCount++;
      } catch (err) {
        console.error(`Error descargando ${url} (${fileName}):`, err);
      }

      return downloadNext();
    };

    // Lanzar varias descargas en paralelo
    await Promise.all(Array.from({ length: CONCURRENCY }, downloadNext));
    console.log(
      `Descarga de imágenes finalizada. Total descargadas: ${downloadedCount}`
    );
  } catch (err) {
    console.error("Error general en downloadNewsImagesToLocal:", err);
    throw err;
  }
}
