# Canarias Racing Team Web

![@tomas2p](https://img.shields.io/badge/Developed_by-Tomas2p-c97a00?style=for-the-badge)
[![Astro](https://img.shields.io/badge/Built_with-Astro-0f172a?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Styled_with-TailwindCSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![DaisyUI](https://img.shields.io/badge/UI-DaisyUI-5a0fc8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com)
![Repo](https://img.shields.io/badge/Repo_Private-yes-4b5563?style=for-the-badge&logo=github&logoColor=white)
[![Notion](https://img.shields.io/badge/CMS-Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://notion.so)

---

Sitio web oficial del primer equipo de Fórmula Student de Canarias.  
Desarrollado con [Astro](https://astro.build), [TailwindCSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/).

**Ahora incluye:** Sección de blog/noticias conectada a Notion como CMS y diseño completamente responsive.

## 📰 Noticias y Blog

Las noticias y posts del blog se gestionan desde una base de datos de Notion y se muestran automáticamente en la sección `/news` del sitio.  
Cada noticia se presenta como un post de blog, usando el componente `SectionSample` para mostrar imagen, título, descripción y enlace a la noticia completa.

## 📱 Diseño Responsive

El sitio web cuenta con un diseño completamente responsive optimizado para:

- **Desktop**: Experiencia completa con navegación horizontal y componentes expandidos
- **Tablet**: Adaptación fluida de componentes y navegación
- **Mobile**: Menú hamburguesa, componentes apilados y optimización táctil

## 🎬 Preview v0.1

[![Preview v0.1](https://img.youtube.com/vi/preview/0.jpg)](/public/web-v0.1.mp4)
> _Haz clic en la imagen para ver el video de la versión 0.1 mostrando la estructura, navegación y componentes principales de la web._

## 🚀 Estructura del proyecto

```text
/
├── public/
│   ├── favicon.svg
│   └── web-v0.1.mp4
├── src/
│   ├── assets/
│   │   ├── app.css
│   │   ├── astro.svg
│   │   ├── background.svg
│   │   ├── carComponents.json
│   │   ├── imagesExample.json
│   │   ├── logos-crteam/
│   │   └── logos-partners-2425/
│   ├── components/
│   │   ├── Buttons.astro
│   │   ├── Card.astro
│   │   ├── Carousel.astro
│   │   ├── CarTabs.astro
│   │   ├── FlagDivider.astro
│   │   ├── Footer.astro
│   │   ├── Gallery.astro
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   ├── Section.astro
│   │   └── Stats.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── news.astro
│   │   └── news/
│   │       └── [slug].astro
│   ├── utils/
│   │   ├── imageUtils.ts
│   │   └── notion.ts
│   ├── types.ts
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
```

## 🧑‍💻 Scripts útiles

| Comando           | Acción                                              |
| ----------------- | --------------------------------------------------- |
| `npm install`     | Instala las dependencias                            |
| `npm run dev`     | Inicia el servidor de desarrollo (`localhost:4321`) |
| `npm run build`   | Genera el sitio para producción en `./dist/`        |
| `npm run preview` | Previsualiza el sitio generado                      |
| `npm run check`   | Revisa el tipado y errores de Astro                 |
| `npm run astro`   | Ejecuta cualquier comando de astro (`astro check`)  |

## 🛠️ Tecnologías principales

- **Astro**: Framework principal para el desarrollo del sitio.
- **TailwindCSS**: Utilidad CSS para estilos rápidos y responsivos.
- **DaisyUI**: Componentes UI sobre Tailwind para desarrollo ágil.
- **TypeScript**: Tipado estático para mayor robustez del código.
- **Notion**: CMS para gestionar noticias y posts del blog.
- **Astro Icons**: Librería de iconos para componentes visuales.

## 📦 Componentes destacados

- `Hero.astro`: Sección principal de bienvenida con diseño responsive.
- `Navbar.astro`: Barra de navegación fija con menú hamburguesa para móviles.
- `FlagDivider.astro`: Separador con los colores de la bandera de Canarias.
- `Carousel.astro`: Galería horizontal de imágenes/avatares adaptable.
- `CarTabs.astro`: Componente de pestañas con scroll horizontal para mostrar componentes del coche.
- `Gallery.astro`: Galería de imágenes responsive.
- `Card.astro`: Componente de tarjeta flexible y responsive.
- `Section.astro`: Componente de sección adaptable.
- `Stats.astro`: Estadísticas visuales optimizadas para todos los dispositivos.
- `Buttons.astro`: Componente de botones reutilizable.
- `Footer.astro`: Pie de página con información del equipo.

## ✅ Lista de tareas

1. **Configuración inicial**
   - [x] Clonar repo y crear rama `main`
   - [x] Instalar dependencias (`npm install`)

2. **Configuración de Tailwind y DaisyUI**
   - [x] Instalar Tailwind, DaisyUI y tailwindcss/vite
   - [x] Configurar Tailwind y DaisyUI

3. **Estructura de la web**
   - [x] Crear página principal (`index.astro`)
   - [x] Crear página de noticias/blog (`news.astro`)
   - [x] Crear página dinámica de noticias (`news/[slug].astro`)
   - [ ] Crear páginas adicionales (`about.astro`, `projects.astro`, `contact.astro`)
   - [x] Crear componentes reutilizables (`Navbar`, `Footer`, `Buttons`, `FlagDivider`, `Carousel`, `CarTabs`, `Gallery`, `Hero`, `Card`, `Section`, `Stats`)
   - [x] Crear sistema de tipos TypeScript (`types.ts`)
   - [x] Crear utilidades (`imageUtils.ts`, `notion.ts`)

4. **Funcionalidad**
   - [x] Agregar formularios de contacto
   - [x] Galería/carrusel de imágenes y avatares
   - [x] Diseño responsive y moderno
   - [x] Integración con Notion para noticias/blog
   - [x] Corrección de errores en navbar y componente stats
   - [x] Optimización del diseño móvil
   - [x] Componente de pestañas con scroll horizontal (`CarTabs`)
   - [x] Sistema de assets y recursos organizados
   - [x] Tipado TypeScript completo

5. **Configurar Notion CMS**
   - [x] Instalar NotionHQ
   - [x] Configurar base de datos en Notion
   - [x] Configurar webhook en Notion
   - [x] Enlazar con web Astro para mostrar noticias/blog

6. **Despliegue**
   - [ ] Configurar despliegue en Vercel
   - [ ] Desplegar y comprobar funcionamiento

7. **SEO y rendimiento**
   - [ ] Configurar metadatos y mejoras de accesibilidad
   - [ ] Optimizar imágenes y recursos

8. **Documentación**
   - [ ] Crear una Wiki en GitHub con instrucciones sobre el código para el futuro

## 🌐 Despliegue

El sitio es estático y puede desplegarse en cualquier hosting compatible (Vercel, Netlify, GitHub Pages, etc).

## 🤝 Contribuir

1. Haz un fork del repositorio.
2. Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit.
4. Abre un Pull Request.

---

Desarrollado para Canarias Racing Team 🚗💨 por @tomas2p
