import { Client } from "@notionhq/client";
import type { NotionPageType } from "@types";

const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });
const databaseId = import.meta.env.NOTION_DATABASE_ID;
const DEBUG = false; // Cambia a true para ver los logs de depuración

export async function getNotionPages(): Promise<NotionPageType[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const filteredResults = response.results
    .filter(
      (
        page
      ): page is import("@notionhq/client/build/src/api-endpoints").PageObjectResponse =>
        "properties" in page
    )
    .map((page) => {
      const props = page.properties;
      return {
        Publicado:
          props.Publicado?.type === "checkbox"
            ? (props.Publicado.checkbox ?? false)
            : false,
        Contenido:
          props.Contenido && props.Contenido.type === "rich_text"
            ? props.Contenido.rich_text.map((text) => text.plain_text).join("")
            : "",
        Fecha:
          props["Fecha de Publicación"]?.type === "created_time"
            ? props["Fecha de Publicación"].created_time
            : page.created_time,
        Imagen:
          props.Imagen && props.Imagen.type === "files"
            ? props.Imagen.files?.[0]?.type === "file"
              ? props.Imagen.files[0].file.url
              : props.Imagen.files?.[0]?.type === "external"
                ? props.Imagen.files[0].external.url
                : ""
            : "",
        url:
          props.url && props.url.type === "rich_text"
            ? (props.url.rich_text?.[0]?.plain_text ?? "")
            : "",
        Nombre:
          props.Nombre && props.Nombre.type === "title"
            ? (props.Nombre.title?.[0]?.plain_text ?? "")
            : "",
        Autor:
          props.Autor &&
          props.Autor.type === "people" &&
          props.Autor.people?.[0]
            ? (props.Autor.people[0] as any).name || ""
            : "",
      };
    })
    .filter((page) => page.Publicado === true);

  // Debug simple - mostrar datos filtrados
  if (DEBUG) {
    console.log(`📰 Notion: ${filteredResults.length} páginas procesadas`);

    // Mostrar solo el length del contenido para debug más limpio
    const debugData = filteredResults.map((page) => ({
      ...page,
      Contenido: `${page.Contenido.length} caracteres`,
      Imagen: page.Imagen ? "URL de imagen" : "Sin imagen",
      url: page.url ? "URL presente" : "Sin URL",
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
    console.log("🔧 Notion BD:", Object.keys(response.properties).join(", "));
  }

  return response.properties;
}
