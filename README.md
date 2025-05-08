# Canarias Racing Team Web

[![Astro](https://img.shields.io/badge/Built_with-Astro-0f172a?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TailwindCSS](https://img.shields.io/badge/Styled_with-TailwindCSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![DaisyUI](https://img.shields.io/badge/UI-DaisyUI-5a0fc8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com)
![Repo](https://img.shields.io/badge/Repo_Private-yes-4b5563?style=for-the-badge&logo=github&logoColor=white)

---

Sitio web oficial del primer equipo de Fórmula Student de Canarias.  
Desarrollado con [Astro](https://astro.build), [TailwindCSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/).  
**Próximamente:** CMS con [Notion](https://notion.so) y despliegue en [Vercel](https://vercel.com).

## 🚀 Estructura del proyecto

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Avatar.astro
│   │   ├── Carousel.astro
│   │   ├── FlagDivider.astro
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   └── SectionSample.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── package.json
└── README.md
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
- **TypeScript**: Tipado estático opcional.

## 📦 Componentes destacados

- `Hero.astro`: Sección principal de bienvenida.
- `Navbar.astro`: Barra de navegación fija.
- `FlagDivider.astro`: Separador con los colores de la bandera de Canarias.
- `Carousel.astro`: Galería horizontal de imágenes/avatares.
- `SectionSample.astro`: Sección reutilizable para contenido destacado.

## 🌐 Despliegue

El sitio es estático y puede desplegarse en cualquier hosting compatible (Vercel, Netlify, GitHub Pages, etc).

## 🤝 Contribuir

1. Haz un fork del repositorio.
2. Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit.
4. Abre un Pull Request.

---

Desarrollado por Canarias Racing Team 🚗💨
