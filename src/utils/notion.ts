import { Client } from "@notionhq/client";
import type { NotionPageType } from "@types";

// Soporte para variables de entorno en Node.js y Astro
let NOTION_API_KEY: string | undefined;
let NOTION_DATABASE_ID: string | undefined;

if (
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV !== "production"
) {
  // Solo cargar dotenv en Node.js, no en Astro
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();
  } catch {}
}

if (typeof import.meta !== "undefined" && import.meta.env) {
  NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
  NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;
} else if (typeof process !== "undefined" && process.env) {
  NOTION_API_KEY = process.env.NOTION_API_KEY;
  NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
}

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  throw new Error(
    "Faltan las variables de entorno NOTION_API_KEY o NOTION_DATABASE_ID"
  );
}
const notion = new Client({ auth: NOTION_API_KEY });
const databaseId: string = NOTION_DATABASE_ID;
const DEBUG = false; // Cambia a false en producción

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
