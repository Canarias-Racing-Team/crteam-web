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
 * Carga imágenes desde `/src/assets/{folder}` y detecta si son destacadas según lista predefinida
 */
export async function loadImageEntries(folder: string): Promise<ImageEntry[]> {
  // Lista predefinida de archivos destacados para cada carpeta
  const featuredFiles: { [key: string]: string[] } = {
    "logos-partners-2425": [
      "cajasiete.png",
      "ayuntamiento-la-laguna.png",
      "coiitf.png",
      "ull.png",
      "metrotenerife.png",
    ],
  };

  // Importa todas las imágenes de todas las subcarpetas de assets
  const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/*/*.{jpg,jpeg,png,webp}",
    { eager: true }
  );

  // Filtra solo las imágenes de la carpeta deseada
  const filteredEntries = Object.entries(imageModules).filter(([path]) =>
    path.includes(`/src/assets/${folder}/`)
  );

  const featuredList = featuredFiles[folder] || [];
  const fileNames = filteredEntries.map(([path]) => path.split("/").pop());

  // Prepara info para debug
  const filesInfo = filteredEntries.map(([path]) => {
    const file = path.split("/").pop()!;
    const featured = featuredList.includes(file);
    return { file, featured };
  });

  if (DEBUG) {
    console.log(`Procesando carpeta: ${folder}`);
    console.log("featuredList:", featuredList);
    console.log("Archivos en carpeta:", fileNames);
    filesInfo.forEach(({ file, featured }) =>
      console.log(`Archivo: ${file} - featured: ${featured}`)
    );
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

/**
 * Función alternativa para cargar imágenes sin usar import.meta.glob
 */
export async function loadImageEntriesSimple(
  folder: string
): Promise<ImageEntry[]> {
  // Lista manual de archivos conocidos para logos-partners-2425
  const knownFiles = [
    "cajasiete.png",
    "ayuntamiento-la-laguna.png",
    "ayuntamiento-los-llanos-de-aridane.png",
    "ayuntamiento-santiago-del-teide.png",
    "coiitf.png",
    "colegio-ingenieros.png",
    "fgull.png",
    "matlab.png",
    "metrotenerife.png",
    "ng-brakes.png",
    "solidworks.png",
    "tesla-t-symbol.png",
    "ull-esit.png",
    "ull.png",
  ];

  const featuredFiles = [
    "cajasiete.png",
    "ayuntamiento-la-laguna.png",
    "coiitf.png",
    "ull.png",
    "metrotenerife.png",
  ];

  const imageEntries: ImageEntry[] = [];

  for (const fileName of knownFiles) {
    try {
      const imagePath = `/src/assets/${folder}/${fileName}`;
      const imageModule = await import(/* @vite-ignore */ imagePath);

      const alt = fileName.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
      const featured = featuredFiles.includes(fileName);

      imageEntries.push({
        file: fileName,
        alt,
        featured,
        src: () => Promise.resolve(imageModule.default),
      });
    } catch (error) {
      console.warn(`No se pudo cargar ${fileName}:`, error);
    }
  }

  return imageEntries;
}
