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
        "Canarias Racing Team (CRT) es el primer y único equipo automovilístico que representa a las Islas en la Formula Student, la competición universitaria más prestigiosa del mundo del motor.",
        "Nacimos en la Universidad de La Laguna con una idea clara: demostrar que desde Canarias también se puede innovar, competir y dejar huella. En nuestro caso, con un monoplaza eléctrico diseñado y manufacturado por un grupo interdisciplinar de más de treinta estudiantes.",
        "Los 2.000 kilómetros que nos separan del resto de Europa no nos frenan: nos impulsan, porque más que un equipo, somos una generación que quiere romper barreras y llevar al Archipiélago a lo más alto del panorama internacional. Desde Canarias para el mundo, kilómetro a kilómetro. Esto es CRT.",
      ],
    },
    car: {
      title: "Tenesera",
      subtitle: "Nuestro monoplaza eléctrico",
      paragraphs: [
        "Un vehículo impulsado por un motor EMRAX 228, con un chasis tubular y alimentado por baterías Tesla de 333V y 150A.",
        "Diseñado bajo un enfoque técnico y analítico, Tenesera aspira a conseguir un alto nivel de rendimiento en pista que destaque por la aceleración y por su capacidad para cumplir con los exigentes estándares de la Fórmula Student",
      ],
    },
    contact: {
      title: "Sé parte del equipo",
      subtitle: "Súmate a Canarias Racing Team",
      paragraphs: [
        "Tu apoyo es clave para que este sueño siga rodando. Ya sea como patrocinador o colaborador, hay muchas formas de unirte a esta aventura.",
        "Escríbenos, siguenos en redes y acompáñanos en cada paso.",
        "Juntos llevamos el talento canario a lo más alto.",
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
