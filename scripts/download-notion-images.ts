import "dotenv/config";
import { getNotionPages } from "../src/utils/notion.js";
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../src/assets/fotos/news-images");

async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error descargando ${url}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const pages = await getNotionPages();
  for (const page of pages) {
    if (!page.Imagen || !page.url) continue;
    const ext = path.extname(new URL(page.Imagen).pathname) || ".jpg";
    const filename = path.join(OUTPUT_DIR, `${page.url}${ext}`);
    try {
      await downloadImage(page.Imagen, filename);
      console.log(`Descargada: ${filename}`);
    } catch (e) {
      console.error(`Error con ${page.url}:`, e);
    }
  }
}

main();
