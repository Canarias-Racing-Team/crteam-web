import type { ImageMetadata } from "astro";
import type { ImageEntry } from "@types";

// Solo importar fs y path si se usa en entorno Node (server-side)
let fs: typeof import("fs") | undefined;
let path: typeof import("path") | undefined;
if (import.meta.env.SSR) {
  fs = await import("fs");
  path = await import("path");
}

const DEBUG = false;

/**
 * Carga imágenes desde `/src/assets/fotos/{folder}`.
 * Si se pasa una lista de archivos, solo carga esos; si no, carga todas las de la carpeta.
 */

export async function loadImageEntries(
  folder: string,
  fileNames?: string[]
): Promise<ImageEntry[]> {
  // Siempre carga todas las imágenes de la carpeta usando import.meta.glob
  let imageModules = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/fotos/**/*.{jpg,jpeg,png,webp,JPG}",
    { eager: true }
  );
  const folderPath = `/src/assets/fotos/${folder}`;
  // Filtra imágenes de la carpeta y subcarpetas
  imageModules = Object.fromEntries(
    Object.entries(imageModules).filter(
      ([path]) => path.startsWith(folderPath + "/") || path === folderPath
    )
  );

  let entries = Object.entries(imageModules);
  // Si se pasan fileNames, filtra solo esas
  if (fileNames) {
    const fileSet = new Set(fileNames);
    entries = entries.filter(([path]) => fileSet.has(path.split("/").pop()!));
  }

  // Debug: muestra información de las imágenes cargadas
  if (DEBUG) {
    console.log(
      JSON.stringify(
        {
          folder,
          total: entries.length,
          files: entries.map(([path, mod]) => path.split("/").pop()),
        },
        null,
        2
      )
    );
  }
  return entries.map(([path, mod]) => {
    const file = path.split("/").pop()!;
    const alt = file.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
    return {
      file,
      alt,
      src: mod.default,
      featured: false,
    };
  });
}

/**
 * Devuelve la ruta pública de la imagen local si existe, o null si no existe.
 * @param slug string (ej: "mi-articulo")
 * @param exts extensiones a probar
 * @returns string | null
 */
export function getLocalNewsImage(
  slug: string,
  exts = [".jpg", ".jpeg", ".png", ".webp"]
): string | null {
  if (!fs || !path) return null;
  const dir = path.join(process.cwd(), "src/assets/fotos/news-images");
  for (const ext of exts) {
    const filePath = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      // Ruta relativa para import estático en Astro
      return `/src/assets/fotos/news-images/${slug}${ext}`;
    }
  }
  return null;
}
