// Textos de la aplicación
export const texts = {
  // Textos de la página de noticias
  news: {
    noticias: {
      title: "Noticias",
      subtitle: "Lo último de CRTeam",
      paragraphs: [
        "Sigue de cerca todo lo que hacemos: competiciones, avances, logros y próximos eventos.",
      ],
    },
    newsletter: {
      title: "Newsletter",
      subtitle: "Las novedades, directo a tu correo",
      paragraphs: [
        "Suscríbete a nuestro newsletter y entérate antes que nadie de todo lo que pasa en Canarias Racing Team.",
      ],
    },
  },

  // Textos de la página principal
  home: {
    team: {
      title: "Canarias Racing Team",
      subtitle: "El primer equipo de Fórmula Student de Canarias",
      paragraphs: [
        "Somos el equipo de automovilismo de la Universidad de La Laguna y los primeros en llevar el nombre de las ocho islas canarias a la Fórmula Student, la competición universitaria más top del mundo del motor.",
        "Lo hicimos con un monoplaza eléctrico que no entiende de límites, ni siquiera los 2.000 km que nos separan de la península.",
        "Más que un equipo, somos un grupo de estudiantes con ganas de romper barreras. Ingeniería, comunicación, finanzas… aquí cada talento suma.",
        "Nuestra meta es clara: que la innovación hecha en Canarias acelere el futuro. Y lo hacemos con pasión, trabajo en equipo y creyendo que, desde lo pequeño, se pueden construir cosas enormes.",
      ],
    },
    car: {
      title: "El Coche",
      subtitle: "Un coche único, para unas islas únicas.",
      paragraphs: [
        "Nuestro monoplaza eléctrico, hecho por estudiantes desde cero, combina ingeniería, innovación y trabajo en equipo para brillar en la Fórmula Student.",
        "Cada pieza refleja esfuerzo y talento canario. Aquí no solo gana el más rápido, sino el que mejor diseña y gestiona su proyecto.",
      ],
    },
    contact: {
      title: "¡Hazte parte del equipo!",
      subtitle: "Súmate a Canarias Racing Team",
      paragraphs: [
        "Tu apoyo es clave para que este sueño siga rodando. Ya sea como patrocinador o colaborador, hay muchas formas de unirte a esta aventura.",
        "Escríbenos por correo o síguenos en redes para estar al tanto de todo lo que viene. ¡Juntos llevamos el talento canario a lo más alto!",
      ],
    },
  },

  // Textos de la página individual de noticias
  newsDetails: {
    newInfo: {
      title: "Noticia",
      subtitle: ["Noticia completa"],
      paragraphs: [
        "Aquí tienes todos los detalles de esta noticia del Canarias Racing Team.",
      ],
    },

    aboutTeam: {
      title: "Sobre el equipo",
      subtitle: "Canarias Racing Team",
      paragraphs: [
        "Somos el equipo automovilístico de la Universidad de La Laguna y representamos a Canarias en la Formula Student con un monoplaza eléctrico. Desde 2017, competimos a nivel internacional, uniendo innovación, formación práctica y pasión por el motor.",
        "Nuestro objetivo: formar a futuros profesionales en ingeniería y gestión de proyectos mientras llevamos el nombre de Canarias a lo más alto del automovilismo universitario.",
      ],
    },
  },

  // Textos de placeholders
  placeholders: {
    news: {
      title: "Próximamente",
      content: "Estamos trabajando en las próximas noticias. ¡Vuelve pronto!",
    },
  },
};

// Función auxiliar para crear contenido de Card
export function createCardContent(section: any) {
  const content = [];

  if (section.title) {
    content.push({
      type: "title",
      text: section.title,
    });
  }

  if (section.subtitle) {
    if (Array.isArray(section.subtitle)) {
      section.subtitle.forEach((subtitle: string) => {
        content.push({
          type: "subtitle",
          text: subtitle,
        });
      });
    } else {
      content.push({
        type: "subtitle",
        text: section.subtitle,
      });
    }
  }

  if (section.paragraphs) {
    section.paragraphs.forEach((paragraph: string) => {
      content.push({
        type: "paragraph",
        text: paragraph,
      });
    });
  }

  return content;
}
