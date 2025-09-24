// Textos de la aplicación
export const texts = {
  // Enlaces de redes sociales
  links: {
    instagram: "https://www.instagram.com/canariasracingteam/",
    linkedin: "https://www.linkedin.com/company/canariasracingteam/",
    dossier: "/dossieres/dossier_crt_25-26.pdf",
    wallpapers: "/crteam-wallpapers.zip",
    // Formulario de inscripción al equipo
    joinUs: "https://docs.google.com/forms/d/e/1FAIpQLSfRk5ihl_rh55yh7abRbm05h9jfGZc3mQtAMFY83TTa19v6XA/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaeGqOrGvAWiggXYPpWpVhG4KIC6Ecg2X10e7rmjCJ2DsDxmjEzH2fn8_n9D8w_aem_khcKTbCMwKBH7bWlA6JYUA"
  },
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
      subtitle: "El Primer Equipo de Fórmula Student de Canarias",
      paragraphs: [
        "Canarias Racing Team es el único equipo que representa a Canarias en la Formula Student, la competición automovilística más prestigiosa del mundo a nivel universitario.",
        "Nacimos en la Universidad de La Laguna en 2017 con una idea clara: demostrar que en Canarias también se puede innovar, competir y dejar huella. En nuestro caso, lo hacemos con un monoplaza eléctrico diseñado y manufacturado por un grupo interdisciplinar de estudiantes de todas las islas.",
        "A más de 1.700 kilómetros del continente europeo, Canarias no es solo un punto geográfico alejado, es una tierra de talento y ambición. Somos más que la distancia ultraperiférica. Somos una generación que quiere romper barreras y llevar a este Archipiélago a lo más alto del panorama internacional. Somos Canarias Racing Team.",
      ],
    },
    car: {
      title: "Tenesera",
      subtitle: "Nuestro monoplaza eléctrico",
      paragraphs: [
        "Un vehículo impulsado por un motor EMRAX 228, con un chasis tubular y un sistema de alimentación compuesto por baterías Tesla de 333 voltios y 150 amperios.",
        "Diseñado bajo un enfoque técnico y analítico, nuestro monoplaza aspira a lograr un alto nivel de rendimiento en pista. Destaca su aceleración y ligereza.",
      ],
    },
    contact: {
      title: "Sé parte del equipo",
      subtitle: "Súmate a Canarias Racing Team",
      paragraphs: [
        "Tu apoyo es fundamental para que este proyecto siga rodando. Como patrocinador o colaborador podrás formar parte de una iniciativa que fomenta el desarrollo tecnológico y automotriz.",
        "Contacta con nosotros, síguenos en redes y vibra junto a nosotros en cada carrera. Juntos llevamos el talento canario a lo más alto.",
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
