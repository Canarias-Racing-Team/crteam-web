// Tipos globales para el proyecto

export type AvatarType = {
  src: string;
  alt: string;
  size?: number;
};

export type CarouselItemType = {
  src: string;
  alt?: string;
  name?: string;
  icon?: string;
  brief?: string;
};

export type StatType = {
  title: string;
  value: string | number;
  desc?: string;
  color?: string;
};

export type CarComponentType = {
  name: string;
  icon?: string;
  src: string;
  brief: string;
};

export type SectionSampleLinkType = {
  href: string;
  text: string;
  icon?: string;
};

export type NotionPageType = {
  Publicado: boolean;
  Contenido: string;
  Fecha: string;
  Imagen?: string;
  url: string;
  Nombre: string;
  Autor?: string;
  width?: number;
  height?: number;
};

export type ImageEntry = {
  file: string;
  alt: string;
  featured: boolean;
  src: ImageMetadata;
};
