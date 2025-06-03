import type { ImageMetadata } from "astro";
import type { ImageEntry } from "@types";

const DEBUG = false; // Cambia a true para ver los logs de depuración

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
  const featuredPath = `../assets/${folder}/featured.txt?raw`;
  const featuredTxt = await import(/* @vite-ignore */ featuredPath).catch(
    () => ({ default: "" })
  );

  const featuredTxtModule: { default: string } = featuredTxt;
  const featuredList: string[] = featuredTxtModule.default
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
