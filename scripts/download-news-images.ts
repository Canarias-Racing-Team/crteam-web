// scripts/download-news-images.ts
// Script para descargar imágenes de Notion a /src/assets/fotos/news-images

import "dotenv/config";
import { downloadNewsImagesToLocal } from "../src/utils/notion.ts";

(async () => {
  try {
    await downloadNewsImagesToLocal();
    console.log("Descarga de imágenes completada.");
  } catch (err) {
    console.error("Error en la descarga de imágenes:", err);
    process.exit(1);
  }
})();
