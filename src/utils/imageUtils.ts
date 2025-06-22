import type { ImageMetadata } from "astro";
import type { ImageEntry } from "@types";

const DEBUG = false; // Cambia a true para ver los logs de depuración

/**
 * Función de depuración para mostrar información sobre las imágenes destacadas
 * y los archivos en la carpeta.
 * @param featuredPath Ruta al archivo featured.txt
 * @param featuredTxtModule Módulo importado de featured.txt
 * @param featuredList Lista de archivos destacados
 * @param fileNames Nombres de los archivos encontrados
 * @param filesInfo Información de los archivos con estado de destacado
 */
function debugFeatured({
  featuredPath,
  featuredTxtModule,
  featuredList,
  fileNames,
  filesInfo,
}: {
  featuredPath: string;
  featuredTxtModule: { default: string };
  featuredList: string[];
  fileNames: (string | undefined)[];
  filesInfo: { file: string; featured: boolean }[];
}) {
  console.log("Intentando importar:", featuredPath);
  console.log("featured.txt raw:", JSON.stringify(featuredTxtModule.default));
  console.log("featuredList:", featuredList);
  console.log("Archivos en carpeta:", fileNames);
  filesInfo.forEach(({ file, featured }) =>
    console.log(`Archivo: ${file} - featured: ${featured}`)
  );
}

/**
 * Carga imágenes desde `/src/assets/{folder}` y detecta si son destacadas usando `featured.txt`
 */
export async function loadImageEntries(folder: string): Promise<ImageEntry[]> {
  // Importa todas las imágenes de todas las subcarpetas de assets
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/*/*.{jpg,jpeg,png,webp}",
    { eager: true }
  );

  // Filtra solo las imágenes de la carpeta deseada
  const filteredEntries = Object.entries(imageModules).filter(([path]) =>
    path.includes(`/src/assets/${folder}/`)
  );

  // Construye la ruta relativa desde src/utils a src/assets
  const featuredPath = `/src/assets/${folder}/featured.txt?raw`; // Cambiar a ruta absoluta
  const featuredTxt = await import(/* @vite-ignore */ featuredPath).catch(
    (error) => {
      console.error(`Error al importar ${featuredPath}:`, error);
      return { default: "" };
    }
  );

  const featuredTxtModule: { default: string } = featuredTxt;
  const rawContent = featuredTxtModule.default;

  // Limpia el contenido eliminando caracteres invisibles o innecesarios
  const cleanedContent = rawContent
    .replace(/\r/g, "") // Elimina retornos de carro (Windows)
    .trim();

  if (DEBUG) {
    console.log(
      "Contenido original de featured.txt:",
      JSON.stringify(rawContent)
    );
    console.log(
      "Contenido limpio de featured.txt:",
      JSON.stringify(cleanedContent)
    );
  }

  const featuredList: string[] = cleanedContent
    .split("\n")
    .map((f: string) => f.trim())
    .filter((line: string) => Boolean(line));

  const fileNames = filteredEntries.map(([path]) => path.split("/").pop());

  // Prepara info para debug
  const filesInfo = filteredEntries.map(([path]) => {
    const file = path.split("/").pop()!;
    const featured = featuredList.includes(file);
    return { file, featured };
  });

  if (DEBUG) {
    debugFeatured({
      featuredPath,
      featuredTxtModule,
      featuredList,
      fileNames,
      filesInfo,
    });
  }

  if (!featuredTxtModule.default) {
    console.warn(`El archivo ${featuredPath} está vacío o no existe.`);
  }

  return filteredEntries.map(([path, mod]) => {
    const file = path.split("/").pop()!;
    const alt = file.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
    const featured = featuredList.includes(file);
    return {
      file,
      alt,
      featured,
      src: () => Promise.resolve((mod as any).default),
    };
  });
}
