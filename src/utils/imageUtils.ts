import type { ImageMetadata } from "astro";
import type { ImageEntry } from "@types";

const DEBUG = false;

/**
 * Carga im?genes desde `/src/assets/fotos/{folder}`.
 * Si se pasa una lista de archivos, solo carga esos; si no, carga todas las de la carpeta.
 */
export async function loadImageEntries(
  folder: string,
  fileNames?: string[]
): Promise<ImageEntry[]> {
  let imageModules: Record<string, { default: ImageMetadata }> = {};

  if (!fileNames) {
    // Carga todas las im?genes de la carpeta usando un glob est?tico y filtrando por carpeta
    imageModules = import.meta.glob<{ default: ImageMetadata }>(
      "/src/assets/fotos/**/*.{jpg,jpeg,png,webp,JPG}",
      { eager: true }
    );
    // Filtra im?genes de la carpeta y subcarpetas
    const folderPath = `/src/assets/fotos/${folder}`;
    imageModules = Object.fromEntries(
      Object.entries(imageModules).filter(
        ([path]) => path.startsWith(folderPath + "/") || path === folderPath
      )
    );
  } else {
    // Solo carga las im?genes especificadas
    await Promise.all(
      fileNames.map(async (fileName) => {
        const imagePath = `/src/assets/fotos/${folder}/${fileName}`;
        try {
          const imageModule = await import(/* @vite-ignore */ imagePath);
          imageModules[imagePath] = { default: imageModule.default };
        } catch (error) {
          console.warn(`No se pudo cargar ${fileName}:`, error);
        }
      })
    );
  }

  const entries = Object.entries(imageModules);
  // Debug: muestra informaci?n de las im?genes cargadas
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
