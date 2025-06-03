import { Client } from "@notionhq/client";

const notion = new Client({ auth: import.meta.env.NOTION_API_KEY });
const databaseId = import.meta.env.NOTION_DATABASE_ID;

export type NotionPage = {
  Publicado: boolean;
  Contenido: string;
  Fecha: string;
  Imagen: string;
  url: string;
  Nombre: string;
};

export async function getNotionPages(): Promise<NotionPage[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results
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
            ? (props.Contenido.rich_text?.[0]?.plain_text ?? "")
            : "",
        Fecha:
          props["Fecha de Publicación"]?.type === "date"
            ? (props["Fecha de Publicación"].date?.start ?? "")
            : "",
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
      };
    });
}
